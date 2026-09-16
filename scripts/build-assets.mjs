/**
 * Erzeugt alle abgeleiteten Bild-Assets aus den Originaldateien des
 * Kunden in `brand/`.
 *
 * Aufruf: node scripts/build-assets.mjs
 * Nötig, wenn Logo oder Hero-Bild getauscht werden.
 *
 * Ergebnis:
 *   public/logo.webp            Bildzeichen freigestellt, für Header und Opener
 *   public/logo-lockup.webp     Sperrmarke mit Schriftzug, für den Footer
 *   public/favicon-32.png       Monogramm, kleines Favicon
 *   public/apple-touch-icon.png Monogramm, 180 px
 *   public/icon-512.png         Monogramm, 512 px für das Web-Manifest
 *   public/og.jpg               Vorschaubild für soziale Netzwerke
 */
import sharp from 'sharp';

/*
  Beide Logodateien kommen bereits mit Alphakanal, 2000 px im Quadrat.
  Ein Freistellen entfaellt damit, es bleibt das Wegschneiden der
  transparenten Raender.
*/
const LOGO = 'brand/mkstress_logo_neu.png';
/* Sperrmarke: Bildzeichen mit Schriftzug darunter. Im Footer ist genug
   Platz dafuer, dort ersetzt sie die Kombination aus Bildzeichen plus
   separatem Text. */
const LOGO_LOCKUP = 'brand/mkstress_logo_neu_komplett.png';
const HERO = 'src/assets/hero.jpeg';

const NAVY = '#0a1226';
const COPPER = '#dd7d38';
const BONE = '#f7f8fc';

/**
 * Schneidet einen durchgehend weissen Block am unteren Rand weg.
 *
 * `mkstress_logo_neu.png` bringt unter dem Motiv 220 Zeilen deckendes
 * Weiss mit, ueber die volle Breite. Das ist ein Ueberbleibsel aus dem
 * Export, kein Gestaltungselement, und wuerde auf der dunklen Seite als
 * heller Riegel unter dem Logo stehen.
 *
 * Erkannt wird der Block, statt ihn fest zu verdrahten: liefert der
 * Kunde die Datei sauber nach, passiert hier einfach nichts.
 */
async function dropWhiteFooter(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const isWhiteRow = (y) => {
    let white = 0;
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 250 && data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) white++;
    }
    return white > info.width * 0.9;
  };

  /* Ganz unten sitzen ein paar Zeilen, die deckend, aber nicht weiss
     sind: die Abrisskante des Artefakts. Die duerfen den Block nicht
     verdecken, deshalb ein kleiner Spielraum. */
  let y = info.height - 1;
  for (let slack = 0; y >= 0 && slack < 6 && !isWhiteRow(y); slack++) y--;

  const runEnd = y;
  while (y >= 0 && isWhiteRow(y)) y--;
  const run = runEnd - y;

  /* Unter 20 Zeilen ist es kein Riegel, sondern Teil des Motivs. */
  if (run < 20) return sharp(input).ensureAlpha().png().toBuffer();

  const height = y + 1;
  console.log(`  ${info.height - height} Zeilen weisser Rand entfernt`);
  return sharp(input)
    .ensureAlpha()
    .extract({ left: 0, top: 0, width: info.width, height })
    .png()
    .toBuffer();
}

/**
 * Bringt eine Logodatei auf ihren tatsaechlichen Inhalt.
 *
 * Erst die durchsichtigen Raender weg, dann den weissen Riegel, dann
 * noch einmal die Raender: der Riegel liegt unter dem Motiv, aber ueber
 * den leeren Zeilen ganz unten, und waere andersherum nicht erreichbar.
 *
 * Die Trimm-Schwelle liegt bewusst nicht bei null. Um das Motiv liegt
 * ein weicher Schein mit sehr geringer Deckkraft, der sonst als breiter
 * unsichtbarer Rahmen stehen bliebe und das Logo im Header kleiner
 * erscheinen liesse, als es ist.
 */
async function trimEdges(file) {
  const trimmed = await sharp(file).ensureAlpha().trim({ threshold: 6 }).png().toBuffer();
  const cleaned = await dropWhiteFooter(trimmed);
  return sharp(cleaned).trim({ threshold: 6 }).png().toBuffer();
}

const logo = await trimEdges(LOGO);
const logoMeta = await sharp(logo).metadata();
console.log(`Bildzeichen: ${logoMeta.width}x${logoMeta.height}`);

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

/* Sperrmarke fuer den Footer. */
const lockup = await trimEdges(LOGO_LOCKUP);
const lockupMeta = await sharp(lockup).metadata();
console.log(`Sperrmarke: ${lockupMeta.width}x${lockupMeta.height}`);
await sharp(lockup)
  .resize({ width: 640 })
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile('public/logo-lockup.webp');

/*
  Favicon aus dem Monogramm.

  Bei 32 px ist die Fahrzeugkontur nur noch ein Schleier, das MK traegt
  allein. Der Ausschnitt nimmt deshalb den Buchstabenblock aus der Mitte
  und laesst die auslaufende Silhouette links und rechts weg. Die Werte
  sind Anteile der getrimmten Breite, damit sie bei einer neuen
  Logodatei nicht verrutschen.
*/
const monogram = await sharp(logo)
  .extract({
    left: Math.round(logoMeta.width * 0.2),
    top: Math.round(logoMeta.height * 0.3),
    width: Math.round(logoMeta.width * 0.6),
    height: Math.round(logoMeta.height * 0.7),
  })
  .trim({ threshold: 6 })
  .png()
  .toBuffer();

/*
  Dunkle Platte, nicht helle.

  Das Logo besteht aus Kupfer und Chrom. Chrom ist nahezu weiss und
  verschwindet auf hellem Grund, das "M" war auf der bisherigen
  Bone-Platte praktisch unsichtbar. Auf Navy stehen beide Metalle.
*/
async function icon(size, file) {
  const pad = Math.round(size * 0.12);
  const inner = await sharp(monogram)
    .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'inside' })
    .png()
    .toBuffer();
  const innerMeta = await sharp(inner).metadata();

  const plate = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${NAVY}"/>
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
     <text x="76" y="428" font-family="DejaVu Sans" font-size="60" font-weight="bold" fill="${COPPER}">Den Rest mache ich.</text>
     <rect x="76" y="468" width="120" height="5" rx="2.5" fill="${COPPER}"/>
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
  'Assets erzeugt: logo.webp, logo-lockup.webp, favicon-32.png, apple-touch-icon.png, icon-512.png, og.jpg',
);
