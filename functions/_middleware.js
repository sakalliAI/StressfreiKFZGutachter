/**
 * Leitet Aufrufe der technischen *.pages.dev-Adresse auf die
 * eingerichtete Hauptdomain um, damit keine zweite indexierbare Kopie
 * der Seite entsteht.
 *
 * Aktiv nur, wenn die Umgebungsvariable CANONICAL_HOST gesetzt ist:
 *
 *   wrangler pages secret put CANONICAL_HOST      (oder als Plain-Env)
 *   Beispielwert: www.kundendomain.de
 *
 * Solange die Variable fehlt, passiert nichts. Damit bleibt die
 * Vorschau unter mk-stressfrei.pages.dev bis zum Go-Live erreichbar.
 */
export async function onRequest({ request, env, next }) {
  const host = env.CANONICAL_HOST;

  if (host && request.method === 'GET') {
    const url = new URL(request.url);
    if (url.hostname.endsWith('.pages.dev') && url.hostname !== host) {
      url.hostname = host;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
  }

  return next();
}
