/**
 * robots.txt aus der Konfiguration.
 *
 * Frueher eine feste Datei mit eingetragener Domain. Beim Wechsel auf die
 * Kundendomain haette man daran denken muessen; jetzt zieht sie mit
 * `site` in astro.config.mjs automatisch nach.
 *
 * KI-Crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) sind
 * bewusst nicht ausgesperrt. Wer in ChatGPT oder Perplexity nach einem
 * Gutachter in Ingolstadt fragt, soll diese Seite als Quelle finden.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://www.mk-stressfrei.de')).origin;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap-index.xml`, ''].join(
    '\n',
  );
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
