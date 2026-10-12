/**
 * Kleine Bausteine fuer Schema.org.
 *
 * Der Kern (Unternehmen, Website, Breadcrumbs) steht in
 * src/layouts/Layout.astro. Hier liegen die Knoten, die einzelne Seiten
 * zusaetzlich mitgeben.
 */

export interface QA {
  readonly q: string;
  readonly a: string;
}

/** FAQPage. Nur fuer Fragen, die auf derselben Seite sichtbar stehen. */
export function faqSchema(items: readonly QA[], id: string): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Eine Leistung, angeboten vom Unternehmen aus dem Layout. */
export function serviceSchema(input: {
  origin: string;
  url: string;
  name: string;
  description: string;
  serviceType: string;
  areaServed: readonly string[];
}): Record<string, unknown> {
  return {
    '@type': 'Service',
    '@id': `${input.url}#service`,
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: input.url,
    provider: { '@id': `${input.origin}/#business` },
    areaServed: input.areaServed.map((name) => ({ '@type': 'City', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceLocation: { '@type': 'Place', name: 'Beim Kunden vor Ort' },
    },
  };
}

/** Eine Seite, die ein bestimmtes Thema behandelt. */
export function webPageSchema(input: {
  url: string;
  name: string;
  description: string;
  origin: string;
  about?: string;
}): Record<string, unknown> {
  return {
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    isPartOf: { '@id': `${input.origin}/#website` },
    ...(input.about ? { about: { '@id': input.about } } : {}),
  };
}
