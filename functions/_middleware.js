/**
 * Leitet alle Zweitadressen der Seite per 301 auf die Hauptdomain um,
 * damit keine zweite indexierbare Kopie entsteht: die Vorschau unter
 * mk-stressfrei.sakalli.ai und die technische Adresse
 * mk-stressfrei.pages.dev.
 *
 * Aktiv nur, wenn die Umgebungsvariable CANONICAL_HOST gesetzt ist,
 * etwa www.mk-stressfrei.de.
 *
 * Ausgenommen sind die Vorschauen einzelner Deployments
 * (<hash>.mk-stressfrei.pages.dev). Die kennzeichnet Cloudflare selbst
 * mit noindex, und sie bleiben so zum Pruefen vor dem Livegang nutzbar.
 */
const PREVIEW = /^[a-z0-9-]+\.mk-stressfrei\.pages\.dev$/;

export async function onRequest({ request, env, next }) {
  const host = env.CANONICAL_HOST;

  if (host && (request.method === 'GET' || request.method === 'HEAD')) {
    const url = new URL(request.url);
    if (url.hostname !== host && !PREVIEW.test(url.hostname)) {
      url.hostname = host;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
  }

  return next();
}
