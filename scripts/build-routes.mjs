/**
 * Berechnet die Anfahrt vom Buero zu jedem Ort im Einsatzgebiet.
 *
 * Aufruf: node scripts/build-routes.mjs
 * Noetig, wenn sich die Bueroadresse oder die Orteliste in
 * `src/data/site.ts` aendert.
 *
 * Warum: Die Ortsseiten sollen sich durch echte Angaben unterscheiden,
 * nicht durch einen ausgetauschten Ortsnamen. Strassenentfernung,
 * Fahrzeit, die Strassen auf dem Weg und der Landkreis sind belegbar
 * und fuer jemanden mit einem Schaden in Manching tatsaechlich
 * nuetzlich. Die Route selbst wird auf der Ortskarte eingezeichnet.
 *
 * Quellen, beide zur Bauzeit, nie im Browser:
 *   Route:     OSRM (router.project-osrm.org), Daten von OpenStreetMap
 *   Landkreis: Nominatim (nominatim.openstreetmap.org)
 *
 * OSRM rechnet ohne Verkehr. Die Fahrzeiten sind deshalb untere Werte
 * und werden auf der Seite als "ohne Stau" ausgewiesen.
 *
 * Ergebnis: src/data/routes.json
 */
import { writeFile } from 'node:fs/promises';

// site.ts ist TypeScript. Statt einen Compiler einzuspannen, werden die
// beiden benoetigten Bloecke hier gezielt herausgelesen.
import { readFile } from 'node:fs/promises';

const UA = 'MK-Stressfrei-Website-Build/1.0 (+https://mk-stressfrei.sakalli.ai)';
const OUT = 'src/data/routes.json';

const source = await readFile('src/data/site.ts', 'utf8');

const officeMatch = /office:\s*\{\s*lat:\s*([\d.]+),\s*lon:\s*([\d.]+)\s*\}/.exec(source);
if (!officeMatch) throw new Error('office-Koordinate in site.ts nicht gefunden');
const office = { lat: Number(officeMatch[1]), lon: Number(officeMatch[2]) };

const places = [
  ...source.matchAll(/slug:\s*'([^']+)',[\s\S]*?lat:\s*([\d.]+),\s*lon:\s*([\d.]+)/g),
].map((m) => ({ slug: m[1], lat: Number(m[2]), lon: Number(m[3]) }));
if (places.length === 0) throw new Error('Keine Orte in site.ts gefunden');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} fuer ${url}`);
  return res.json();
}

/** Douglas-Peucker, damit die Route nicht mit tausenden Punkten im JSON landet. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-12;
    const dist = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}

/**
 * Fasst die Abschnitte nach Strasse zusammen und behaelt nur die, auf
 * denen ein nennenswerter Teil der Strecke liegt. Bundesstrassen und
 * Autobahnen werden ueber ihre Nummer benannt, alles andere ueber den
 * Namen.
 */
function mainRoads(steps, total) {
  const order = [];
  const sum = new Map();
  for (const step of steps) {
    const ref = (step.ref || '').split(';')[0].trim();
    const key = ref || (step.name || '').trim();
    if (!key) continue;
    if (!sum.has(key)) order.push(key);
    sum.set(key, (sum.get(key) ?? 0) + step.distance);
  }
  return order
    .filter((key) => (sum.get(key) ?? 0) >= total * 0.15)
    .map((key) => ({ road: key, km: Math.round(((sum.get(key) ?? 0) / 1000) * 10) / 10 }));
}

const result = {};

for (const place of places) {
  const route = await getJson(
    `https://router.project-osrm.org/route/v1/driving/${office.lon},${office.lat};${place.lon},${place.lat}` +
      '?overview=full&geometries=geojson&steps=true',
  );
  if (route.code !== 'Ok') throw new Error(`Keine Route nach ${place.slug}: ${route.code}`);
  const r = route.routes[0];
  const steps = r.legs.flatMap((leg) => leg.steps);

  await sleep(1100); // Nominatim erlaubt eine Anfrage pro Sekunde.
  const reverse = await getJson(
    `https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&addressdetails=1&lat=${place.lat}&lon=${place.lon}`,
  );

  const geometry = simplify(r.geometry.coordinates, 0.0004).map(([lon, lat]) => [
    Math.round(lat * 1e5) / 1e5,
    Math.round(lon * 1e5) / 1e5,
  ]);

  result[place.slug] = {
    km: Math.round((r.distance / 1000) * 10) / 10,
    minutes: Math.round(r.duration / 60),
    roads: mainRoads(steps, r.distance),
    county: reverse.address?.county ?? null,
    geometry,
  };

  const info = result[place.slug];
  console.log(
    `${place.slug.padEnd(26)} ${String(info.km).padStart(5)} km  ${String(info.minutes).padStart(3)} min  ` +
      `${info.roads
        .map((x) => x.road)
        .join(', ')
        .padEnd(28)} ${info.county}  (${geometry.length} Punkte)`,
  );
  await sleep(1100);
}

await writeFile(
  OUT,
  JSON.stringify(
    { office, generated: new Date().toISOString().slice(0, 10), places: result },
    null,
    2,
  ) + '\n',
);
console.log(`\nGeschrieben: ${OUT}`);
