/**
 * Zentrale Inhalts- und Stammdaten der Website.
 *
 * Alles was der Kunde spaeter selbst pflegt, steht hier an einer Stelle.
 * Offene Punkte sind mit TODO markiert und in docs/handover.md gelistet.
 */

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly claim: string;
  /** Alt-Text des Kartenbilds. Die Bilddatei selbst wird in
   *  Services.astro ueber die id zugeordnet (astro:assets braucht
   *  statische Importe). */
  readonly alt: string;
  readonly detail: readonly string[];
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

/** Ort im Einsatzgebiet, verortet ueber Entfernung und Peilung. */
export interface Place {
  readonly name: string;
  readonly km: number;
  readonly bearing: number;
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
  email: 'vato-bosna@web.de',

  /**
   * Ort und Einsatzgebiet. Steuert Title, Schema.org und alle
   * Textbausteine, in denen der Ort vorkommt.
   *
   * TODO(Kunde): Die Orteliste unten ist aus "Ingolstadt und Umgebung"
   * abgeleitet. Bitte einmal durchsehen und streichen oder ergaenzen,
   * je nachdem wie weit tatsaechlich gefahren wird.
   */
  city: 'Ingolstadt' as string | null,
  region: 'Ingolstadt und Umgebung' as string | null,
  radiusKm: 50,
  /* Entfernung in Kilometern und Peilung in Grad ab Ingolstadt, damit
     die Einsatzgebiet-Karte die Orte an ihrer ungefaehr richtigen
     Stelle zeigt statt willkuerlich verteilt. */
  places: [
    { name: 'Gaimersheim', km: 6, bearing: 315 },
    { name: 'Kösching', km: 10, bearing: 40 },
    { name: 'Großmehring', km: 9, bearing: 95 },
    { name: 'Manching', km: 10, bearing: 185 },
    { name: 'Neuburg a. d. Donau', km: 22, bearing: 275, short: 'Neuburg' },
    { name: 'Pfaffenhofen', km: 30, bearing: 150 },
  ] as readonly Place[],

  /** TODO(Kunde): Ladungsfaehige Anschrift fuer das Impressum. */
  street: null as string | null,
  zip: null as string | null,

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
  { id: 'leistungen', label: 'Leistungen' },
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
    text: 'Immer bei Verletzten, Streit über die Schuld, Fahrerflucht oder Mietwagen im Spiel.',
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
    title: 'Haftpflichtschaden',
    claim: 'Unverschuldet erwischt worden. Die Gegenseite zahlt das Gutachten.',
    alt: 'Eingedrückter Kotflügel und gebrochener Scheinwerfer nach einer Kollision',
    detail: [
      'Vollständiges Schadengutachten mit Reparaturkosten, Wertminderung, Wiederbeschaffungs- und Restwert.',
      'Ausfallschaden und Nutzungsausfall werden mit erfasst, damit nichts liegen bleibt.',
      'Bei unverschuldetem Unfall trägt die gegnerische Haftpflichtversicherung die Kosten nach § 249 BGB. Sie zahlen nichts vor.',
      'Sie dürfen den Gutachter frei wählen. Auch wenn die Versicherung der Gegenseite jemand anderen vorschlägt.',
    ],
  },
  {
    id: 'kasko',
    title: 'Kaskoschaden',
    claim: 'Wildunfall, Hagel, Vandalismus oder selbst verursacht.',
    alt: 'Glassplitter einer zerborstenen Scheibe auf der Rückbank',
    detail: [
      'Aufnahme und Bewertung des Schadens für Teil- und Vollkasko.',
      'Abstimmung mit Ihrer eigenen Versicherung, damit die Regulierung nicht hängen bleibt.',
      'Kostenübernahme klären wir vorher gemeinsam. Manche Versicherer beauftragen selbst, dann sage ich Ihnen das ehrlich.',
    ],
  },
  {
    id: 'kurzgutachten',
    title: 'Kurzgutachten',
    claim: 'Kleiner Schaden unterhalb der Bagatellgrenze.',
    alt: 'Delle mit aufgerissenem Lack an einer Fahrzeugtür im Gegenlicht',
    detail: [
      'Für Schäden unter rund 750 Euro erkennen Versicherungen oft nur einen Kostenvoranschlag an.',
      'Ich schaue mir den Schaden an und sage Ihnen, was in Ihrem Fall sinnvoll ist.',
      'Kalkulation mit den üblichen Systemen, damit die Zahlen für die Versicherung nachvollziehbar sind.',
    ],
  },
  {
    id: 'wertgutachten',
    title: 'Wertgutachten',
    claim: 'Für Verkauf, Versicherung oder den Oldtimer in der Garage.',
    alt: 'Oldtimer in einer Werkstatt, angeleuchtet von einer Arbeitsleuchte',
    detail: [
      'Zeitwert, Marktwert oder Wiederbeschaffungswert, je nachdem wofür Sie den Nachweis brauchen.',
      'Oldtimer- und Youngtimerbewertung inklusive Zustandsnote für die Versicherung.',
      'Festpreis vorher abgesprochen. Keine Überraschung auf der Rechnung.',
    ],
  },
  {
    id: 'beweissicherung',
    title: 'Beweissicherung',
    claim: 'Schaden dokumentiert, bevor jemand daran schraubt.',
    alt: 'Schichtdickenmessgerät an einer beschädigten Fahrzeugtür',
    detail: [
      'Lückenlose Fotodokumentation und Vermessung, solange der Zustand noch original ist.',
      'Wichtig bei strittiger Schuldfrage oder wenn ein Rechtsstreit im Raum steht.',
      'Die Unterlagen sind so aufbereitet, dass Anwalt und Gericht damit arbeiten können.',
    ],
  },
  {
    id: 'leasing',
    title: 'Leasingrückgabe',
    claim: 'Zustand prüfen, bevor der Händler die Rechnung schreibt.',
    alt: 'Prüfprotokoll auf einem Klemmbrett, abgelegt auf einer Motorhaube',
    detail: [
      'Neutrale Zustandsaufnahme vor der Rückgabe, mit klarer Trennung von normalem Verschleiß und echtem Schaden.',
      'Damit haben Sie eine Grundlage in der Hand, falls Nachforderungen kommen.',
      'Am besten ein bis zwei Wochen vor dem Rückgabetermin.',
    ],
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
    a: 'Bei einem unverschuldeten Unfall zahlt die Haftpflichtversicherung des Unfallgegners. Das ergibt sich aus § 249 BGB. Sie gehen nicht in Vorleistung. Bei Teilschuld wird anteilig abgerechnet, bei einem Kaskoschaden klären wir die Kostenübernahme vorher mit Ihrer Versicherung. Sind Sie selbst schuld, nenne ich Ihnen vor dem Termin einen Festpreis.',
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
   SEO
   ------------------------------------------------------------------ */

export const seo = {
  title: 'KFZ Gutachter Ingolstadt nach Unfall | MK Stressfrei',
  description:
    'DESAG geprüfter Kfz-Sachverständiger in Ingolstadt und Umgebung. Unabhängiges Unfallgutachten, Termin oft am selben Tag, Besichtigung bei Ihnen vor Ort. Bei unverschuldetem Unfall zahlt die gegnerische Versicherung.',
  ogImage: '/img/og.jpg',
} as const;
