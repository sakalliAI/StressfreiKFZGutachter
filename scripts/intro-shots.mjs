/**
 * Fängt einzelne Bilder des Openers ab und prüft, ob das Logo am Ende
 * tatsächlich auf der Position des Header-Logos landet.
 *
 * Aufruf: node scripts/intro-shots.mjs [basis-url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4327';
const OUT = '/tmp/shots/intro';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const FRAMES = [2600, 3300, 3550, 3800, 4100, 4400, 4700];

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(`${BASE}/?intro`, { waitUntil: 'domcontentloaded' });

  // Screenshots kosten Zeit, deshalb wird die echte Uhr mitgeführt statt
  // stumpf zu warten.
  const started = Date.now();
  for (const at of FRAMES) {
    const wait = at - (Date.now() - started);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: `${OUT}/${viewport.name}-${String(at).padStart(4, '0')}.png` });
  }

  // Landung prüfen: Overlay weg, Header-Logo wieder sichtbar.
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => {
    const header = document.querySelector('[data-header] [data-brand-logo]');
    return {
      overlayWeg: document.getElementById('intro') === null,
      headerLogoSichtbar: header ? getComputedStyle(header).visibility === 'visible' : false,
      scrollGesperrt: document.documentElement.style.overflow === 'hidden',
    };
  });

  console.log(`[${viewport.name}]`, JSON.stringify(state), errors.length ? errors : '');
  await context.close();
}

await browser.close();
