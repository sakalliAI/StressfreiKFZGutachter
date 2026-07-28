/**
 * Baut das Kartenbild für den Abschnitt "Einsatzgebiet".
 *
 * Aufruf: node scripts/build-map.mjs
 * Nötig, wenn sich Mittelpunkt, Maßstab oder Bildgröße in
 * `src/data/map-config.mjs` ändern.
 *
 * Warum zur Bauzeit und nicht im Browser: eine eingebettete Karte lädt
 * bei jedem Aufruf Daten von einem Dritten und wäre damit
 * einwilligungspflichtig. Diese Seite kommt ohne Cookie-Banner aus, das
 * soll so bleiben. Das fertige Bild liegt deshalb im Repository und
 * wird mit ausgeliefert. Kacheln werden lokal zwischengespeichert,
 * damit ein zweiter Lauf keine Anfragen mehr stellt.
 *
 * Die Daten stammen von OpenStreetMap und stehen unter der ODbL. Die
 * Nennung "© OpenStreetMap-Mitwirkende" steht sichtbar an der Karte,
 * siehe `src/components/CoverageMap.astro`.
 *
 * Ergebnis: src/assets/karte-einsatzgebiet.webp
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import {
  CENTER,
  MAP_H,
  MAP_W,
  TILE_SIZE,
  TILE_ZOOM,
  tileScale,
  worldPx,
} from '../src/data/map-config.mjs';

const CACHE = '.cache/tiles';
const OUT = 'src/assets/karte-einsatzgebiet.webp';

/* Die Kachelnutzungsregeln von OpenStreetMap verlangen eine
   aussagekräftige Kennung. Anonyme Massenabrufe werden geblockt. */
const UA = 'MK-Stressfrei-Website-Build/1.0 (+https://mk-stressfrei.sakalli.ai)';

const scale = tileScale();
/* Ausschnitt in Kachel-Bildpunkten, den wir am Ende auf MAP_W x MAP_H
   herunterrechnen. */
const srcW = Math.ceil(MAP_W * scale);
const srcH = Math.ceil(MAP_H * scale);

const center = worldPx(CENTER.lat, CENTER.lon);
const left = center.x - srcW / 2;
const top = center.y - srcH / 2;

const x0 = Math.floor(left / TILE_SIZE);
const x1 = Math.floor((left + srcW - 1) / TILE_SIZE);
const y0 = Math.floor(top / TILE_SIZE);
const y1 = Math.floor((top + srcH - 1) / TILE_SIZE);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tile(z, x, y) {
  const file = path.join(CACHE, `${z}-${x}-${y}.png`);
  if (existsSync(file)) return readFile(file);

  const res = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
    headers: { 'User-Agent': UA, Accept: 'image/png' },
  });
  if (!res.ok) throw new Error(`Kachel ${z}/${x}/${y} nicht geladen: ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  /* Kurz warten, damit der Abruf den Kachelservern nicht als Schwall
     ankommt. Läuft nur beim allerersten Durchgang. */
  await sleep(250);
  return buf;
}

await mkdir(CACHE, { recursive: true });

const cols = x1 - x0 + 1;
const rows = y1 - y0 + 1;
console.log(`Kacheln: ${cols} x ${rows} bei Zoom ${TILE_ZOOM}`);

const parts = [];
for (let x = x0; x <= x1; x += 1) {
  for (let y = y0; y <= y1; y += 1) {
    parts.push({
      input: await tile(TILE_ZOOM, x, y),
      left: x * TILE_SIZE - Math.round(left),
      top: y * TILE_SIZE - Math.round(top),
    });
  }
}

const stitched = await sharp({
  create: { width: srcW, height: srcH, channels: 3, background: '#e8e4dc' },
})
  .composite(parts)
  .png()
  .toBuffer();

/* Rohmontage mit ablegen. Damit lässt sich die farbliche Behandlung
   unten anpassen, ohne die Kachelserver erneut zu behelligen. */
await writeFile(path.join(CACHE, 'stitched.png'), stitched);

/*
  Farbliche Behandlung.

  Die Standardkarte von OpenStreetMap ist hell und bunt und stünde
  neben dem übrigen Erscheinungsbild wie ein Fremdkörper. Umgekehrt
  bringt einfaches Abdunkeln nichts: Straßen und Flächen liegen in der
  Helligkeit dicht beieinander, die Zeichnung würde verschwinden.

  Deshalb wird das Bild umgekehrt. Danach liegt die helle Fläche unten
  und die Straßen zeichnen sich ab. Erst dann Kontrast und Farbton.

  Zwei Durchgänge, weil sharp die Umkehrung intern vor der linearen
  Anpassung ausführt, unabhängig von der Reihenfolge im Aufruf. In
  einem Durchgang würde die Kurve auf das Original wirken und alles
  ins Schwarze drücken.
*/
const inverted = await sharp(stitched)
  .resize(MAP_W, MAP_H, { fit: 'cover', kernel: 'lanczos3' })
  .greyscale()
  .negate({ alpha: false })
  .png()
  .toBuffer();

await sharp(inverted).linear(1.5, -14).tint('#8ba4d4').webp({ quality: 80 }).toFile(OUT);

console.log(`Karte erzeugt: ${OUT} (${MAP_W}x${MAP_H})`);
