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
   * TODO(Kunde): Ort und Einsatzgebiet eintragen.
   * Solange `city` null ist, rendert die Seite eine neutrale Formulierung.
   * Sobald hier ein Ort steht, greifen automatisch alle lokalen
   * SEO-Textbausteine (Title, Schema.org, Einsatzgebiet-Sektion).
   */
  city: null as string | null,
  region: null as string | null,
  radiusKm: 60,

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
 * Die DESAG-Pruefung ist durch die Visitenkarte des Kunden belegt
 * (brand/VK.png). Alles Weitere bleibt draussen, bis es nachgewiesen
 * ist: eine behauptete oeffentliche Bestellung, TUEV-Zertifizierung
 * oder BVSK-Mitgliedschaft waere nach § 5 UWG irrefuehrend.
 * Vorlagen dafuer: docs/handover.md.
 */
export const trustPoints = [
  {
    title: 'DESAG geprüft',
    text: 'Geprüfter Sachverständiger der Deutschen Sachverständigen Gesellschaft.',
  },
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
    alt: 'Stark beschädigter Kotflügel und Scheinwerfer nach einem Unfall',
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
    alt: 'Zersplitterte Scheibe und Glasbruch im Fahrzeuginnenraum',
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
    alt: 'Eingerissener Stoßfänger an einem gelben Fahrzeug aus der Nähe',
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
    alt: 'Klassischer Oldtimer in einer abgedunkelten Garage',
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
    alt: 'Werkzeug an einer Delle in der Fahrzeugtür bei der Schadenaufnahme',
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
    alt: 'Prüfprotokoll wird auf einem Klemmbrett im Fahrzeug ausgefüllt',
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
    a: 'Bei einem unverschuldeten Unfall zahlt die Haftpflichtversicherung des Unfallgegners. Das ergibt sich aus § 249 BGB. Sie gehen nicht in Vorleistung. Bei Teilschuld wird anteilig abgerechnet, bei einem Kaskoschaden klären wir die Kostenübernahme vorher mit Ihrer Versicherung.',
  },
  {
    q: 'Darf ich den Gutachter frei aussuchen?',
    a: 'Ja. Als Geschädigter bestimmen Sie, wer Ihren Schaden begutachtet. Die gegnerische Versicherung schlägt oft einen eigenen Sachverständigen vor. Sie müssen darauf nicht eingehen.',
  },
  {
    q: 'Wie schnell bekomme ich einen Termin?',
    a: 'In der Regel am selben oder am nächsten Werktag. Wenn es eilt, weil ein Mietwagen läuft oder die Werkstatt auf Freigabe wartet, sagen Sie das gleich beim ersten Kontakt.',
  },
  {
    q: 'Muss ich das Auto irgendwo hinbringen?',
    a: 'Nein. Ich komme zu Ihnen. Zur Werkstatt, nach Hause, auf den Abstellplatz oder zum Abschleppdienst. Ein nicht fahrbereites Fahrzeug ist kein Problem.',
  },
  {
    q: 'Ab welchem Schaden lohnt sich ein Gutachten?',
    a: 'Als Faustregel gilt: ab etwa 750 Euro Schadenhöhe. Darunter erkennen Versicherungen häufig nur einen Kostenvoranschlag an. Ob Ihr Fall darüber liegt, sehe ich meist schon an einem guten Foto.',
  },
  {
    q: 'Was brauche ich für den Termin?',
    a: 'Fahrzeugschein, Führerschein, Ihre Versicherungsdaten und das Kennzeichen des Unfallgegners. Wenn die Polizei da war, dazu das Aktenzeichen. Fehlt etwas, reichen wir es nach.',
  },
  {
    q: 'Wie lange dauert das Gutachten?',
    a: 'Nach der Besichtigung üblicherweise 24 bis 48 Stunden bis zum fertigen Dokument. Bei komplizierten Schäden oder wenn Ersatzteilpreise erst angefragt werden müssen, kann es einen Tag länger dauern.',
  },
  {
    q: 'Brauche ich zusätzlich einen Anwalt?',
    a: 'Bei einem unverschuldeten Unfall trägt die Gegenseite in der Regel auch die Anwaltskosten. Das nimmt Ihnen viel Schriftverkehr ab. Ich sage Ihnen ehrlich, wenn ich es in Ihrem Fall für sinnvoll halte, und arbeite auf Wunsch mit Ihrer Kanzlei zusammen.',
  },
  {
    q: 'Was kostet es, wenn ich selbst schuld bin?',
    a: 'Dann sind Sie Selbstzahler. Ich nenne Ihnen vorher einen Festpreis, der sich an der Schadenhöhe orientiert. Sie wissen also vor dem Termin, woran Sie sind.',
  },
];

/* ------------------------------------------------------------------
   SEO
   ------------------------------------------------------------------ */

export const seo = {
  title: 'KFZ Gutachter nach Unfall | MK Stressfrei',
  description:
    'DESAG geprüfter Kfz-Sachverständiger. Unabhängiges Gutachten nach Unfall, Termin oft am selben Tag, Besichtigung bei Ihnen vor Ort. Bei unverschuldetem Unfall zahlt die gegnerische Versicherung.',
  ogImage: '/img/og.jpg',
} as const;
