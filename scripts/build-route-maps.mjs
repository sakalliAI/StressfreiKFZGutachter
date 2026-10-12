/**
 * Baut fuer jede Ortsseite eine Karte mit der Anfahrt vom Buero.
 *
 * Aufruf: node scripts/build-route-maps.mjs
 * Vorher: node scripts/build-routes.mjs (liefert die Route)
 *
 * Wie bei der Karte auf der Startseite: die Kacheln werden einmal beim
 * Entwickeln von OpenStreetMap geholt, zwischengespeichert, eingefaerbt
 * und als Bild abgelegt. Im Browser geht keine Anfrage an einen Dritten.
 *
 * Der gewaehlte Ausschnitt (Mitte, Massstab, Kachelstufe) wird zurueck
 * in src/data/routes.json geschrieben. Die Komponente RouteMap.astro
 * rechnet damit dieselbe Projektion und legt die Route exakt auf die
 * Strasse.
 *
 * Ergebnis: src/assets/orte/<slug>.webp
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fitView, projector } from '../src/lib/projection.mjs';

const ROUTES = 'src/data/routes.json';
const CACHE = '.cache/tiles';
const OUT_DIR = 'src/assets/orte';
const UA = 'MK-Stressfrei-Website-Build/1.0 (+https://mk-stressfrei.sakalli.ai)';

/* Etwas flacher als die Karte der Startseite: sie steht auf der Ortsseite
   in voller Breite und soll nicht den ganzen Bildschirm fuellen. */
const W = 960;
const H = 540;
const TILE = 256;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tile(z, x, y) {
  const file = path.join(CACHE, `${z}-${x}-${y}.png`);
  if (existsSync(file)) return readFile(file);
  const res = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
    headers: { 'User-Agent': UA, Accept: 'image/png' },
  });
  if (!res.ok) throw new Error(`Kachel ${z}/${x}/${y}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  await sleep(200);
  return buf;
}

/** Gleiche Farbbehandlung wie die Karte der Startseite, siehe build-map.mjs. */
async function tone(input, w, h) {
  const inverted = await sharp(input)
    .resize(w, h, { fit: 'cover', kernel: 'lanczos3' })
    .greyscale()
    .negate({ alpha: false })
    .png()
    .toBuffer();
  return sharp(inverted).linear(1.5, -14).tint('#8ba4d4').webp({ quality: 74 }).toBuffer();
}

await mkdir(CACHE, { recursive: true });
await mkdir(OUT_DIR, { recursive: true });

const data = JSON.parse(await readFile(ROUTES, 'utf8'));

for (const [slug, place] of Object.entries(data.places)) {
  const points = [data.office, ...place.geometry.map(([lat, lon]) => ({ lat, lon }))];
  const view = fitView(points, { w: W, h: H, pad: 0.13 });
  const proj = projector(view);

  // Ausschnitt in Kachel-Weltbildpunkten, danach auf W x H verkleinert.
  const origin = proj.originPx();
  const srcW = Math.ceil(W * proj.scale);
  const srcH = Math.ceil(H * proj.scale);

  const x0 = Math.floor(origin.x / TILE);
  const x1 = Math.floor((origin.x + srcW - 1) / TILE);
  const y0 = Math.floor(origin.y / TILE);
  const y1 = Math.floor((origin.y + srcH - 1) / TILE);

  const parts = [];
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      parts.push({
        input: await tile(view.tileZoom, x, y),
        left: x * TILE - Math.round(origin.x),
        top: y * TILE - Math.round(origin.y),
      });
    }
  }

  const stitched = await sharp({
    create: { width: srcW, height: srcH, channels: 3, background: '#e8e4dc' },
  })
    .composite(parts)
    .png()
    .toBuffer();

  await writeFile(path.join(OUT_DIR, `${slug}.webp`), await tone(stitched, W, H));
  place.view = view;

  console.log(
    `${slug.padEnd(26)} Zoom ${view.tileZoom}  ${String(view.mPerPx).padStart(5)} m/px  ` +
      `${(x1 - x0 + 1) * (y1 - y0 + 1)} Kacheln  Faktor ${proj.scale.toFixed(2)}`,
  );
}

await writeFile(ROUTES, JSON.stringify(data, null, 2) + '\n');
console.log(`\nKarten in ${OUT_DIR}, Ausschnitte in ${ROUTES}`);
