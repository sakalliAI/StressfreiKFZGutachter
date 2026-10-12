/**
 * Inhalte der Unterseiten.
 *
 * Langtexte liegen als Markdown in src/content/, damit sie sich ohne
 * Blick in den Code pflegen lassen. Das Schema prueft beim Bauen, dass
 * jede Seite alles hat, was die Vorlage braucht. Fehlt etwa die
 * Einleitung, bricht der Build mit einer klaren Meldung ab, statt eine
 * halbe Seite auszuliefern.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string().min(8), a: z.string().min(20) });

const leistungen = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/leistungen' }),
  schema: z.object({
    /** Muss zu `services[].id` in src/data/site.ts passen. */
    service: z.string(),
    /** Ueberschrift auf der Seite. */
    title: z.string(),
    /** <title> im Browser und in den Suchergebnissen. Unter 60 Zeichen. */
    seoTitle: z.string().max(62),
    /** Beschreibung in den Suchergebnissen. Unter 160 Zeichen. */
    description: z.string().min(80).max(165),
    /**
     * Direkte Antwort in zwei, drei Saetzen. Steht ganz oben, weil
     * Besucher wie Sprachmodelle die Kernaussage zuerst suchen.
     */
    lead: z.string().min(60),
    /** "Auf einen Blick": kurze, zitierfaehige Fakten. */
    facts: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .min(3)
      .max(5),
    faqs: z.array(faq).min(3),
    /** ids verwandter Leistungen. */
    related: z.array(z.string()).min(2).max(3),
    updated: z.coerce.date(),
  }),
});

const orte = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/orte' }),
  schema: z.object({
    /** Muss zu `places[].slug` in src/data/site.ts passen. */
    place: z.string(),
    description: z.string().min(80).max(165),
    /**
     * Zusaetzliche Fragen nur fuer diesen Ort. Die Standardfragen zu
     * Entfernung und Fahrzeit erzeugt die Vorlage aus routes.json, damit
     * Text und Zahlen nicht auseinanderlaufen.
     */
    faqs: z.array(faq).default([]),
    updated: z.coerce.date(),
  }),
});

export const collections = { leistungen, orte };
