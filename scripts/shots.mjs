/**
 * Sichtprüfung: rendert die gebaute Seite in Chromium und legt
 * Screenshots unter /tmp/shots ab. Meldet zusätzlich Konsolenfehler
 * und horizontales Überlaufen.
 *
 * Aufruf: node scripts/shots.mjs [basis-url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321';
const OUT = '/tmp/shots';
await mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

// Gegen eine Live-URL muss Chromium denselben Proxy nutzen wie curl,
// sonst kommt er nicht ins Netz.
const proxy = process.env.HTTPS_PROXY ?? process.env.https_proxy;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  ...(proxy && !BASE.startsWith('http://127.0.0.1') ? { proxy: { server: proxy } } : {}),
});
let failures = 0;

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    isMobile: viewport.isMobile ?? false,
    hasTouch: viewport.hasTouch ?? false,
    locale: 'de-DE',
  });

  const page = await context.newPage();
  const problems = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) =>
    problems.push(`request: ${request.url()} ${request.failure()?.errorText}`),
  );

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Opener abwarten und wegklicken, damit die Seite sichtbar wird.
  await page.waitForTimeout(3200);

  await page.screenshot({ path: `${OUT}/${viewport.name}-hero.png` });

  // Horizontales Ueberlaufen pruefen.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) problems.push(`horizontaler Ueberlauf: ${overflow}px`);

  // Alle Sektionen einzeln ablichten.
  for (const id of ['sofort', 'leistungen', 'ablauf', 'kosten', 'person', 'faq', 'kontakt']) {
    await page.evaluate((target) => {
      document.getElementById(target)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${viewport.name}-${id}.png` });
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${viewport.name}-footer.png` });

  // Scrollspy am Seitenende: die letzte Sektion muss aktiv sein.
  const activeAtBottom = await page.evaluate(
    () =>
      document
        .querySelector('[data-spy-link][aria-current="true"]')
        ?.getAttribute('data-spy-link') ?? null,
  );
  if (activeAtBottom !== 'kontakt') {
    problems.push(`Scrollspy am Seitenende: "${activeAtBottom}" statt "kontakt"`);
  }

  // Scrollspy beim Hochscrollen: mitten in "kosten" muss "kosten" aktiv sein.
  await page.evaluate(() => {
    document.getElementById('kosten')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page.evaluate(() => window.scrollBy(0, 120));
  await page.waitForTimeout(400);
  const activeUpward = await page.evaluate(
    () =>
      document
        .querySelector('[data-spy-link][aria-current="true"]')
        ?.getAttribute('data-spy-link') ?? null,
  );
  if (activeUpward !== 'kosten') {
    problems.push(`Scrollspy beim Hochscrollen: "${activeUpward}" statt "kosten"`);
  }

  if (problems.length > 0) {
    failures += problems.length;
    console.error(`[${viewport.name}]`);
    for (const problem of problems) console.error(`  - ${problem}`);
  } else {
    console.log(`[${viewport.name}] ohne Befund`);
  }

  await context.close();
}

await browser.close();
process.exit(failures > 0 ? 1 : 0);
