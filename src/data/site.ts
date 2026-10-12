/**
 * Zentrale Inhalts- und Stammdaten der Website.
 *
 * Alles was der Kunde spaeter selbst pflegt, steht hier an einer Stelle.
 * Offene Punkte sind mit TODO markiert und in docs/handover.md gelistet.
 */

export interface NavItem {
  /** Sektion auf der Startseite. */
  readonly id: string;
  readonly label: string;
  /**
   * Eigene Seite zu diesem Punkt. Auf Unterseiten fuehrt der Link
   * dorthin statt zurueck zur Sektion der Startseite.
   */
  readonly page?: string;
}

export interface Service {
  readonly id: string;
  /** Adresse der eigenen Seite: /leistungen/<slug>/ */
  readonly slug: string;
  readonly title: string;
  /**
   * Die Lage in den Worten des Kunden. Wer gerade einen Schaden hat,
   * weiss, ob ihm jemand reingefahren ist. Ob das "Haftpflichtschaden"
   * heisst, weiss er nicht. Fuehrt deshalb auf Startseite und Uebersicht.
   */
  readonly situation: string;
  readonly claim: string;
  /** Alt-Text des Kartenbilds. Die Bilddatei selbst ordnet
   *  service-images.ts ueber die id zu (astro:assets braucht
   *  statische Importe). */
  readonly alt: string;
}

export interface Step {
  readonly n: string;
  readonly title: string;
  readonly text: string;
}

export interface Faq {
  readonly q: string;
  readonly a: string;
}

/**
 * Ort im Einsatzgebiet.
 *
 * Die Koordinaten sind das Rathaus des Ortes, aus der Ortssuche von
 * OpenStreetMap. Bewusst nicht der Gemeindemittelpunkt: der liegt bei
 * Koesching 3,5 km und bei Grossmehring 2 km neben dem Ort auf freiem
 * Feld, und die Route endete dort auf einem Feldweg. Sie
 * setzen die Marke auf der Karte und sind der Endpunkt der Route, die
 * `scripts/build-routes.mjs` ab dem Buero berechnet. Jeder Ort hat eine
 * eigene Seite unter /kfz-gutachter/<slug>/.
 */
export interface Place {
  readonly slug: string;
  readonly name: string;
  /** Amtlicher Name, wie er in Ueberschriften und im Schema steht. */
  readonly fullName: string;
  readonly lat: number;
  readonly lon: number;
  /** Kurzform fuer die Karte, wo lange Namen ueber den Rand laufen. */
  readonly short?: string;
}

/* ------------------------------------------------------------------
   Stammdaten
   ------------------------------------------------------------------ */

const PHONE_RAW = '+491746844888';

export const company = {
  name: 'MK Stressfrei KFZ Gutachter',
  shortName: 'MK Stressfrei',
  owner: 'Kumalic Mersum',
  legalForm: 'Einzelunternehmen',
  phoneDisplay: '0174 6844888',
  phoneHref: `tel:${PHONE_RAW}`,
  phoneIntl: PHONE_RAW,
  /** Vorbelegter Text senkt die Hemmschwelle: der Besucher muss nach
   *  dem Tippen nichts mehr formulieren. */
  whatsapp: `https://wa.me/${PHONE_RAW.replace('+', '')}?text=${encodeURIComponent(
    'Hallo, ich hatte einen Unfall und brauche ein Gutachten. Können wir kurz sprechen?',
  )}`,
  /**
   * Der Wert steht nur hier. Footer, Impressum, Datenschutzerklaerung,
   * Schema und der Hinweis ohne JavaScript ziehen automatisch nach.
   *
   * Hinweis: Das ist die Adresse, die auf der Seite steht. Wohin das
   * Kontaktformular zustellt, regelt davon unabhaengig das Secret
   * MAIL_TO in Cloudflare, siehe docs/handover.md.
   */
  email: 'info@mk-stressfrei.de',

  /** Ladungsfaehige Anschrift, vom Kunden bestaetigt. */
  street: 'Friedensstraße 1b',
  zip: '85055',
  city: 'Ingolstadt',
  region: 'Ingolstadt und Umgebung',
  /** Bundesland, fuer Schema.org und die Datenschutzbehoerde. */
  state: 'Bayern',

  /**
   * Bueroadresse als Koordinate. Aus der OSM-Ortssuche, auf Strassen-
   * ebene: die Hausnummer ist in OSM nicht erfasst. Reicht fuer das
   * Schema und als Startpunkt der Routen zu den Ortsseiten.
   */
  office: { lat: 48.78535, lon: 11.45474 },

  radiusKm: 50,
  /** Mitte der Region auf der Karte im Abschnitt "Ueber mich". */
  coords: { lat: 48.763, lon: 11.425 },

  /*
    TODO(Kunde): Die Orteliste ist aus "Ingolstadt und Umgebung"
    abgeleitet. Bitte durchsehen und streichen oder ergaenzen, je nachdem
    wie weit tatsaechlich gefahren wird. Ein neuer Ort braucht danach
    `node scripts/build-routes.mjs`, siehe docs/handover.md.
  */
  places: [
    {
      slug: 'gaimersheim',
      name: 'Gaimersheim',
      fullName: 'Gaimersheim',
      lat: 48.80895,
      lon: 11.3703,
    },
    { slug: 'koesching', name: 'Kösching', fullName: 'Kösching', lat: 48.81091, lon: 11.50043 },
    {
      slug: 'grossmehring',
      name: 'Großmehring',
      fullName: 'Großmehring',
      lat: 48.76507,
      lon: 11.53361,
    },
    { slug: 'manching', name: 'Manching', fullName: 'Manching', lat: 48.71735, lon: 11.49397 },
    {
      slug: 'neuburg-an-der-donau',
      name: 'Neuburg a. d. Donau',
      fullName: 'Neuburg an der Donau',
      lat: 48.73777,
      lon: 11.17893,
      short: 'Neuburg',
    },
    {
      slug: 'pfaffenhofen-an-der-ilm',
      name: 'Pfaffenhofen a. d. Ilm',
      fullName: 'Pfaffenhofen an der Ilm',
      lat: 48.52962,
      lon: 11.50887,
      short: 'Pfaffenhofen',
    },
  ] as readonly Place[],

  /** TODO(Kunde): Steuernummer oder USt-IdNr. fuer das Impressum. */
  taxId: null as string | null,

  hours: 'Mo bis Sa, 8 bis 20 Uhr. Nach einem Unfall auch außerhalb.',
} as const;

/**
 * Vertrauensmerkmale.
 *
 * Die DESAG-Pruefung steht bewusst nicht hier, sondern im Hero-Chip
 * und in der Sektion "Ueber mich". Sonst stuende sie dreimal
 * untereinander auf demselben Bildschirm.
 *
 * Alles Weitere bleibt draussen, bis es nachgewiesen ist: eine
 * behauptete oeffentliche Bestellung, TUEV-Zertifizierung oder
 * BVSK-Mitgliedschaft waere nach § 5 UWG irrefuehrend.
 * Vorlagen dafuer: docs/handover.md.
 */
export const trustPoints = [
  {
    title: 'Unabhängig',
    text: 'Keine Provision von Werkstatt oder Versicherung. Ich arbeite für Sie, nicht für die Gegenseite.',
  },
  {
    title: 'Ein Ansprechpartner',
    text: 'Vom ersten Anruf bis zum fertigen Gutachten immer dieselbe Nummer. Keine Warteschleife.',
  },
  {
    title: 'Termin vor Ort',
    text: 'Ich komme zu Ihnen. Werkstatt, Zuhause, Abstellplatz oder direkt zur Unfallstelle.',
  },
  {
    title: 'Direkt weitergeleitet',
    text: 'Das fertige Gutachten geht auf Wunsch sofort an Versicherung und Anwalt.',
  },
] as const;

export const nav: readonly NavItem[] = [
  { id: 'sofort', label: 'Sofort-Hilfe' },
  { id: 'leistungen', label: 'Leistungen', page: '/leistungen/' },
  { id: 'ablauf', label: 'Ablauf' },
  { id: 'kosten', label: 'Kosten' },
  { id: 'person', label: 'Über mich' },
  { id: 'faq', label: 'Fragen' },
  { id: 'kontakt', label: 'Kontakt' },
];

/* ------------------------------------------------------------------
   Sofort-Hilfe an der Unfallstelle
   ------------------------------------------------------------------ */

export const emergencySteps: readonly Step[] = [
  {
    n: '1',
    title: 'Absichern',
    text: 'Warnblinker an, Weste anziehen, Warndreieck 50 bis 100 Meter dahinter aufstellen.',
  },
  {
    n: '2',
    title: 'Polizei rufen',
    text: 'Bei Streit über die Schuld, Fahrerflucht, Dienst- oder Mietwagen. Sind Menschen verletzt, geht der Notruf 112 vor.',
  },
  {
    n: '3',
    title: 'Fotografieren',
    text: 'Gesamte Situation, dann beide Fahrzeuge, dann die Schadenstelle nah. Kennzeichen nicht vergessen.',
  },
  {
    n: '4',
    title: 'Nichts unterschreiben',
    text: 'Kein Schuldeingeständnis, keine Papiere der gegnerischen Versicherung. Erst mit mir sprechen.',
  },
];

/* ------------------------------------------------------------------
   Leistungen
   ------------------------------------------------------------------ */

export const services: readonly Service[] = [
  {
    id: 'haftpflicht',
    slug: 'haftpflichtschaden',
    situation: 'Mir ist jemand reingefahren',
    title: 'Haftpflichtschaden',
    claim: 'Unverschuldet erwischt worden. Die Gegenseite zahlt das Gutachten.',
    alt: 'Eingedrückter Kotflügel und gebrochener Scheinwerfer nach einer Kollision',
  },
  {
    id: 'kasko',
    slug: 'kaskoschaden',
    situation: 'Wild, Hagel, Marder oder selbst verursacht',
    title: 'Kaskoschaden',
    claim: 'Teil- oder Vollkasko. Ich kläre vorher mit Ihnen, was Ihr Tarif übernimmt.',
    alt: 'Glassplitter einer zerborstenen Scheibe auf der Rückbank',
  },
  {
    id: 'kurzgutachten',
    slug: 'kurzgutachten',
    situation: 'Nur ein kleiner Schaden',
    title: 'Kurzgutachten',
    claim: 'Unter rund 750 Euro reicht oft ein Kurzgutachten. Ich sage Ihnen vorher, ob das passt.',
    alt: 'Delle mit aufgerissenem Lack an einer Fahrzeugtür im Gegenlicht',
  },
  {
    id: 'wertgutachten',
    slug: 'wertgutachten',
    situation: 'Ich will wissen, was mein Auto wert ist',
    title: 'Wertgutachten',
    claim: 'Für Verkauf, Versicherung oder den Oldtimer in der Garage.',
    alt: 'Oldtimer in einer Werkstatt, angeleuchtet von einer Arbeitsleuchte',
  },
  {
    id: 'beweissicherung',
    slug: 'beweissicherung',
    situation: 'Es gibt Streit, oder der Verursacher ist weg',
    title: 'Beweissicherung',
    claim: 'Schaden dokumentiert, bevor jemand daran schraubt.',
    alt: 'Schichtdickenmessgerät an einer beschädigten Fahrzeugtür',
  },
  {
    id: 'leasing',
    slug: 'leasingrueckgabe',
    situation: 'Mein Leasingvertrag läuft aus',
    title: 'Leasingrückgabe',
    claim: 'Zustand prüfen, bevor der Händler die Rechnung schreibt.',
    alt: 'Prüfprotokoll auf einem Klemmbrett, abgelegt auf einer Motorhaube',
  },
];

/* ------------------------------------------------------------------
   Ablauf
   ------------------------------------------------------------------ */

export const processSteps: readonly Step[] = [
  {
    n: '01',
    title: 'Sie melden sich',
    text: 'WhatsApp, Anruf oder Formular. Ein Foto vom Schaden reicht für den Anfang.',
  },
  {
    n: '02',
    title: 'Wir machen einen Termin',
    text: 'Meist noch am selben oder am nächsten Tag. Ich komme dorthin, wo das Auto steht.',
  },
  {
    n: '03',
    title: 'Ich nehme den Schaden auf',
    text: 'Fotos, Messungen, Fahrzeugdaten. Vor Ort sind wir in der Regel unter einer Stunde durch.',
  },
  {
    n: '04',
    title: 'Gutachten geht raus',
    text: 'Fertig üblicherweise in 24 bis 48 Stunden. Auf Wunsch direkt an Versicherung und Anwalt.',
  },
];

/* ------------------------------------------------------------------
   FAQ. Wird zusaetzlich als FAQPage-Schema ausgegeben.
   ------------------------------------------------------------------ */

export const faqs: readonly Faq[] = [
  {
    q: 'Wer zahlt das Gutachten?',
    a: 'Bei einem unverschuldeten Unfall zahlt die Haftpflichtversicherung des Unfallgegners die erforderlichen Gutachterkosten. Das ergibt sich aus § 249 BGB. Sie gehen nicht in Vorleistung. Bei Teilschuld wird anteilig abgerechnet, bei einem Kaskoschaden klären wir die Kostenübernahme vorher mit Ihrer Versicherung. Sind Sie selbst schuld, nenne ich Ihnen vor dem Termin einen Festpreis.',
  },
  {
    q: 'Darf ich den Gutachter frei aussuchen?',
    a: 'Ja. Als Geschädigter bestimmen Sie, wer Ihren Schaden begutachtet. Die gegnerische Versicherung schlägt oft einen eigenen Sachverständigen vor. Sie müssen darauf nicht eingehen.',
  },
  {
    q: 'Wie schnell geht das?',
    a: 'Termin in der Regel am selben oder am nächsten Werktag. Nach der Besichtigung dauert es üblicherweise 24 bis 48 Stunden bis zum fertigen Gutachten. Wenn es eilt, weil ein Mietwagen läuft oder die Werkstatt auf Freigabe wartet, sagen Sie das gleich beim ersten Kontakt.',
  },
  {
    q: 'Muss ich das Auto irgendwo hinbringen?',
    a: 'Nein. Ich komme zu Ihnen, im gesamten Raum Ingolstadt. Zur Werkstatt, nach Hause, auf den Abstellplatz oder zum Abschleppdienst. Ein nicht fahrbereites Fahrzeug ist kein Problem. Bringen Sie zum Termin Fahrzeugschein, Führerschein, Ihre Versicherungsdaten und das Kennzeichen des Unfallgegners mit, bei Polizeieinsatz dazu das Aktenzeichen.',
  },
  {
    q: 'Ab welchem Schaden lohnt sich ein Gutachten?',
    a: 'Als Faustregel gilt: ab etwa 750 Euro Schadenhöhe. Darunter erkennen Versicherungen häufig nur einen Kostenvoranschlag an. Ob Ihr Fall darüber liegt, sehe ich meist schon an einem guten Foto.',
  },
  {
    q: 'Brauche ich zusätzlich einen Anwalt?',
    a: 'Bei einem unverschuldeten Unfall trägt die Gegenseite in der Regel auch die Anwaltskosten. Das nimmt Ihnen viel Schriftverkehr ab. Ich sage Ihnen ehrlich, wenn ich es in Ihrem Fall für sinnvoll halte, und arbeite auf Wunsch mit Ihrer Kanzlei zusammen.',
  },
];

/* ------------------------------------------------------------------
   Kontaktformular
   ------------------------------------------------------------------ */

/**
 * Auswahl "Was ist passiert".
 *
 * Steht ganz oben im Formular, damit die erste Entscheidung eine ist,
 * die jeder ohne Nachdenken treffen kann. Die Werte landen unveraendert
 * im Betreff der Mail, deshalb sind sie kurz gehalten.
 */
export const damageTypes = [
  'Mir ist jemand reingefahren',
  'Hagel, Wild oder Vandalismus',
  'Kleiner Schaden',
  'Ich möchte den Fahrzeugwert wissen',
  'Etwas anderes',
] as const;

/** Wann ein Rueckruf passt. Bei einem Ein-Mann-Betrieb spart das eine Runde. */
export const reachableSlots = [
  'Jetzt gleich',
  'Vormittags',
  'Nachmittags',
  'Abends',
  'Egal, melden Sie sich einfach',
] as const;

/** Grenzen fuer den Foto-Upload. Werden im Browser und in der Function geprueft. */
export const upload = {
  maxFiles: 3,
  /** Laengste Kante nach der Verkleinerung im Browser. */
  maxEdge: 1600,
  /** Obergrenze je Bild nach der Verkleinerung, in Bytes. */
  maxBytes: 1_200_000,
} as const;

/* ------------------------------------------------------------------
   SEO
   ------------------------------------------------------------------ */

export const seo = {
  title: 'KFZ Gutachter Ingolstadt nach Unfall | MK Stressfrei',
  description:
    'Kfz-Gutachter in Ingolstadt: DESAG geprüft, unabhängig, Besichtigung vor Ort. Termin oft am selben Tag. Bei unverschuldetem Unfall zahlt die Gegenseite.',
  /* Liegt als `public/og.jpg` und damit direkt unter der Wurzel. Der
     fruehere Pfad `/img/og.jpg` existierte nicht: Cloudflare Pages
     lieferte dafuer die Startseite mit Status 200 aus, und jede
     Linkvorschau in WhatsApp oder Facebook bekam HTML statt eines
     Bildes zu sehen. */
  ogImage: '/og.jpg',
} as const;
