/**
 * Erzeugt alle abgeleiteten Bild-Assets aus den Originaldateien des
 * Kunden in `brand/`.
 *
 * Aufruf: node scripts/build-assets.mjs
 * Nötig, wenn Logo oder Hero-Bild getauscht werden.
 *
 * Ergebnis:
 *   public/logo.webp            Wortmarke freigestellt, für Header, Footer, Opener
 *   public/favicon-32.png       Monogramm, kleines Favicon
 *   public/apple-touch-icon.png Monogramm, 180 px
 *   public/icon-512.png         Monogramm, 512 px für das Web-Manifest
 *   public/og.jpg               Vorschaubild für soziale Netzwerke
 */
import sharp from 'sharp';

const LOGO = 'brand/Logo.png';
const HERO = 'src/assets/hero.jpg';

const NAVY = '#0a1226';
const GOLD = '#d9a32b';
const BONE = '#f7f8fc';

/**
 * Stellt ein Logo frei, das auf weißem Grund geliefert wurde.
 *
 * Ein einfaches Ausschlüsseln der weißen Pixel hinterlässt an den
 * weichgezeichneten Kanten helle Ränder, die auf dunklem Untergrund als
 * Halo sichtbar werden. Deshalb wird die Deckkraft aus dem hellsten
 * Kanal abgeleitet und die Farbe anschließend gegen Weiß zurückgerechnet.
 * Das funktioniert, weil beide Markenfarben, Blau und Gold, jeweils
 * einen Kanal nahe null haben.
 */
async function knockOutWhite(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const min = Math.min(r, g, b);
    const alpha = 255 - min;

    if (alpha < 6) {
      out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
      continue;
    }

    const scale = 255 / alpha;
    out[i] = Math.max(0, Math.min(255, Math.round((r - min) * scale)));
    out[i + 1] = Math.max(0, Math.min(255, Math.round((g - min) * scale)));
    out[i + 2] = Math.max(0, Math.min(255, Math.round((b - min) * scale)));
    out[i + 3] = alpha;
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

const logo = await knockOutWhite(LOGO);
const logoMeta = await sharp(logo).metadata();
console.log(`Logo freigestellt: ${logoMeta.width}x${logoMeta.height}`);

/*
  Header-Logo als WebP. Es ist auf schmalen Displays das größte
  sichtbare Element und bestimmt damit den LCP. Als PNG waren es rund
  60 KB, verlustbehaftetes WebP mit Alphakanal liegt bei einem Bruchteil
  davon, ohne dass man am Rand einen Unterschied sieht.
  640 px deckt auch die größte Darstellung im Opener auf einem Display
  mit doppelter Pixeldichte ab.
*/
await sharp(logo)
  .resize({ width: 640 })
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile('public/logo.webp');

/*
  Favicon aus dem Monogramm. Die volle Wortmarke ist mit rund 3:1 zu
  breit, um bei 32 px erkennbar zu bleiben, das MK allein trägt.
  Der Ausschnitt wird relativ zur getrimmten Breite berechnet, damit er
  bei einer neuen Logodatei nicht verrutscht.
*/
const monogram = await sharp(logo)
  .extract({
    left: Math.round(logoMeta.width * 0.265),
    top: 0,
    width: Math.round(logoMeta.width * 0.5),
    height: logoMeta.height,
  })
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

async function icon(size, file) {
  const pad = Math.round(size * 0.14);
  const inner = await sharp(monogram)
    .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'inside' })
    .png()
    .toBuffer();
  const innerMeta = await sharp(inner).metadata();

  const plate = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${BONE}"/>
     </svg>`,
  );

  await sharp(plate)
    .composite([
      {
        input: inner,
        top: Math.round((size - innerMeta.height) / 2),
        left: Math.round((size - innerMeta.width) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(file);
}

await icon(32, 'public/favicon-32.png');
await icon(180, 'public/apple-touch-icon.png');
await icon(512, 'public/icon-512.png');

/* Open-Graph-Bild: Hero-Ausschnitt, abgedunkelt, mit Logo und Claim. */
const OG_W = 1200;
const OG_H = 630;

const base = await sharp(HERO)
  .resize(OG_W, OG_H, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 0.74 })
  .toBuffer();

const ogLogo = await sharp(logo).resize({ width: 300 }).png().toBuffer();

/*
  Schriftwahl: In der Build-Umgebung liegt Archivo nur als woff2 vor,
  das librsvg nicht rendert. Für das OG-Bild genügt eine serifenlose
  Systemschrift, es erscheint ausschließlich klein in Link-Vorschauen.
*/
const scrim = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">
         <stop offset="0%" stop-color="${NAVY}" stop-opacity="0.95"/>
         <stop offset="52%" stop-color="${NAVY}" stop-opacity="0.8"/>
         <stop offset="100%" stop-color="${NAVY}" stop-opacity="0.58"/>
       </linearGradient>
     </defs>
     <rect width="${OG_W}" height="${OG_H}" fill="url(#g)"/>
     <text x="76" y="356" font-family="DejaVu Sans" font-size="60" font-weight="bold" fill="${BONE}">Unfall gehabt?</text>
     <text x="76" y="428" font-family="DejaVu Sans" font-size="60" font-weight="bold" fill="${GOLD}">Den Rest mache ich.</text>
     <rect x="76" y="468" width="120" height="5" rx="2.5" fill="${GOLD}"/>
     <text x="76" y="526" font-family="DejaVu Sans" font-size="25" fill="#b8c3dc">DESAG geprüfter Sachverständiger, Termin oft am selben Tag</text>
   </svg>`,
);

await sharp(base)
  .composite([
    { input: scrim, top: 0, left: 0 },
    { input: ogLogo, top: 66, left: 70 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og.jpg');

console.log(
  'Assets erzeugt: logo.webp, favicon-32.png, apple-touch-icon.png, icon-512.png, og.jpg',
);
