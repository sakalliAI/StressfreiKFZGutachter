/**
 * llms.txt: Kurzfassung der Website fuer Sprachmodelle.
 *
 * Ein noch junger, aber verbreiteter Vorschlag (llmstxt.org): eine
 * Markdown-Datei unter /llms.txt, die in wenigen Zeilen sagt, wer hier
 * was anbietet, und auf die wichtigen Seiten verweist. Kostet nichts,
 * und Assistenten wie ChatGPT oder Perplexity finden die Kernfakten
 * ohne das ganze HTML auswerten zu muessen.
 *
 * Wird beim Bauen aus denselben Daten erzeugt wie die Seiten selbst, kann
 * also nicht veralten.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import routes from '../data/routes.json';
import { company, services, seo } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://www.mk-stressfrei.de')).origin;
  const leistungen = await getCollection('leistungen');
  const places = routes.places as Record<string, { km: number; minutes: number }>;

  const lines = [
    `# ${company.name}`,
    '',
    `> ${seo.description}`,
    '',
    `Inhaber: ${company.owner}, DESAG-geprüfter Kfz-Sachverständiger.`,
    `Anschrift: ${company.street}, ${company.zip} ${company.city}.`,
    `Telefon und WhatsApp: ${company.phoneDisplay}. E-Mail: ${company.email}.`,
    `Erreichbarkeit: ${company.hours}`,
    `Einsatzgebiet: ${company.region}, rund ${company.radiusKm} km Umkreis. Besichtigung beim Kunden vor Ort.`,
    'Unabhängig: keine Provision von Werkstätten oder Versicherungen.',
    '',
    '## Leistungen',
    '',
    ...services.map((service) => {
      const entry = leistungen.find((e) => e.data.service === service.id);
      return `- [${service.title}](${origin}/leistungen/${service.slug}/): ${entry?.data.lead ?? service.claim}`;
    }),
    '',
    '## Orte im Einsatzgebiet',
    '',
    `- [${company.city}](${origin}/): Sitz des Büros.`,
    ...company.places.map((place) => {
      const r = places[place.slug];
      const detail = r
        ? ` ${String(r.km).replace('.', ',')} km ab Büro, ohne Stau etwa ${r.minutes} Minuten.`
        : '';
      return `- [${place.fullName}](${origin}/kfz-gutachter/${place.slug}/):${detail}`;
    }),
    '',
    '## Wichtige Fakten',
    '',
    '- Bei einem unverschuldeten Unfall zahlt die Haftpflichtversicherung des Unfallgegners die erforderlichen Gutachterkosten (§ 249 BGB). Der Geschädigte wählt den Gutachter selbst.',
    '- Ein vollständiges Gutachten lohnt sich in der Regel ab rund 1.000 Euro Schadenhöhe. Darunter genügt oft ein Kurzgutachten.',
    '- Termin meist am selben oder am nächsten Werktag, Gutachten üblicherweise 24 bis 48 Stunden nach der Besichtigung.',
    '- Kein Gutachten nach § 23 StVZO (H-Kennzeichen), das stellen nur amtlich anerkannte Prüforganisationen aus.',
    '',
    '## Rechtliches',
    '',
    `- [Impressum](${origin}/impressum/)`,
    `- [Datenschutz](${origin}/datenschutz/)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
