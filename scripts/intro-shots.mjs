/**
 * Fängt einzelne Bilder des Openers ab, um die Animation zu prüfen.
 * Aufruf: node scripts/intro-shots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = '/tmp/shots/intro';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });

const FRAMES = [420, 900, 1100, 1250, 1750, 2150, 2400];
let previous = 0;
for (const at of FRAMES) {
  await page.waitForTimeout(at - previous);
  previous = at;
  await page.screenshot({ path: `${OUT}/t-${String(at).padStart(4, '0')}.png` });
}

await browser.close();
console.log(`Frames abgelegt in ${OUT}`);
