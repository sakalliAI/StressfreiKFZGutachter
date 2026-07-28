/**
 * Kontaktformular. Cloudflare Pages Function.
 *
 * Versand über Brevo (Server in der EU, AVV nach Art. 28 DSGVO).
 * Erwartete Umgebungsvariablen:
 *
 *   BREVO_API_KEY          Secret, per `wrangler pages secret put` gesetzt
 *   MAIL_FROM              z. B. "MK Stressfrei <anfrage@send.sakalli.ai>"
 *   MAIL_TO                Empfängeradresse
 *   TURNSTILE_SECRET_KEY   optional, aktiviert die Turnstile-Prüfung
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Ein Formular auszufüllen dauert länger als das hier. */
const MIN_FILL_MS = 3000;
/** Offensichtlich manipulierter Zeitstempel (mehr als 12 Stunden alt). */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Rate-Limit im Arbeitsspeicher der Isolate.
 *
 * Bewusst einfach gehalten: Es begrenzt den Normalfall zuverlässig,
 * überlebt aber keinen Isolate-Wechsel. Für harte Garantien wäre ein
 * KV-Namespace nötig, siehe docs/handover.md.
 */
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Verhindert unbegrenztes Wachstum bei langlebigen Isolates.
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (stamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

function json(status, message) {
  return new Response(JSON.stringify({ ok: status < 400, message }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

/* Steuerzeichen zu treffen ist hier genau der Zweck. */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Entfernt Steuerzeichen und begrenzt die Länge. */
function clean(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, ' ').trim().slice(0, maxLength);
}

/** Escaping für die HTML-Variante der Mail. Kein Nutzertext ungeprüft. */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

/** Verhindert Header-Injection über den Reply-To-Namen. */
function isSafeHeaderValue(value) {
  return !/[\r\n]/.test(value);
}

async function verifyTurnstile(token, secret, ip) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const response = await fetch(TURNSTILE_VERIFY, { method: 'POST', body });
  if (!response.ok) return false;

  const result = await response.json();
  return result.success === true;
}

async function handleContact(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unbekannt';

  if (rateLimited(ip)) {
    return json(429, 'Zu viele Anfragen in kurzer Zeit. Bitte rufen Sie direkt an.');
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, 'Die Anfrage konnte nicht gelesen werden.');
  }

  if (typeof payload !== 'object' || payload === null) {
    return json(400, 'Die Anfrage konnte nicht gelesen werden.');
  }

  // Honeypot. Bots füllen das unsichtbare Feld aus. Nach außen wird ein
  // Erfolg gemeldet, damit sie es nicht erneut versuchen.
  if (clean(payload.website, 200) !== '') {
    return json(200, 'Angekommen. Ich melde mich zeitnah bei Ihnen.');
  }

  const startedAt = Number.parseInt(String(payload.ts ?? '0'), 10);
  const elapsed = Date.now() - startedAt;
  if (
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    elapsed < MIN_FILL_MS ||
    elapsed > MAX_FILL_MS
  ) {
    return json(400, 'Bitte laden Sie die Seite neu und versuchen Sie es noch einmal.');
  }

  const name = clean(payload.name, 80);
  const phone = clean(payload.phone, 40);
  const email = clean(payload.email, 120);
  const plate = clean(payload.plate, 20);
  const message = clean(payload.message, 2000);
  const privacy =
    payload.privacy === true || payload.privacy === 'on' || payload.privacy === 'true';

  if (name.length < 2 || phone.length < 5 || message.length < 5) {
    return json(400, 'Bitte füllen Sie Name, Telefonnummer und Ihre Nachricht aus.');
  }

  if (!privacy) {
    return json(400, 'Bitte bestätigen Sie die Datenschutzerklärung.');
  }

  if (email !== '' && !isEmail(email)) {
    return json(400, 'Die E-Mail-Adresse sieht nicht korrekt aus.');
  }

  if (!isSafeHeaderValue(name) || !isSafeHeaderValue(email)) {
    return json(400, 'Die Angaben enthalten unzulässige Zeichen.');
  }

  // Turnstile nur prüfen, wenn ein Secret hinterlegt ist.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(payload['cf-turnstile-response'], 4096);
    if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
      return json(400, 'Die Spam-Prüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu.');
    }
  }

  if (!env.BREVO_API_KEY || !env.MAIL_FROM || !env.MAIL_TO) {
    console.error('Konfiguration unvollständig: BREVO_API_KEY, MAIL_FROM oder MAIL_TO fehlt.');
    return json(500, 'Der Versand ist gerade nicht möglich. Bitte rufen Sie direkt an.');
  }

  // MAIL_FROM im Format "Anzeigename <adresse@domain>" zerlegen.
  const fromMatch = /^\s*(.*?)\s*<\s*([^<>\s]+)\s*>\s*$/.exec(env.MAIL_FROM);
  const senderName = (fromMatch?.[1] || '').replace(/^"|"$/g, '') || 'Website';
  const senderEmail = fromMatch?.[2] || env.MAIL_FROM.trim();

  if (!isEmail(senderEmail)) {
    console.error('MAIL_FROM enthaelt keine gueltige Absenderadresse.');
    return json(500, 'Der Versand ist gerade nicht möglich. Bitte rufen Sie direkt an.');
  }

  const rows = [
    ['Name', name],
    ['Telefon', phone],
    ['E-Mail', email || 'nicht angegeben'],
    ['Kennzeichen', plate || 'nicht angegeben'],
  ];

  const textContent = [
    'Neue Anfrage über die Website',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Nachricht:',
    message,
  ].join('\n');

  const htmlContent = `<!doctype html><html lang="de"><body style="margin:0;background:#f4f4f5;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#18181b">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e4e4e7">
<tr><td style="background:#0f1318;padding:20px 24px">
<p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#e8871e">Neue Anfrage</p>
<p style="margin:6px 0 0;font-size:18px;font-weight:bold;color:#faf7f2">Website-Kontaktformular</p>
</td></tr>
<tr><td style="padding:24px">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;line-height:1.6">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#71717a;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:bold;vertical-align:top">${escapeHtml(value)}</td></tr>`,
  )
  .join('')}
</table>
<p style="margin:20px 0 6px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#71717a">Nachricht</p>
<div style="white-space:pre-wrap;font-size:14px;line-height:1.7;background:#fafafa;border-left:3px solid #e8871e;padding:14px 16px;border-radius:0 6px 6px 0">${escapeHtml(message)}</div>
</td></tr>
<tr><td style="padding:14px 24px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#a1a1aa">
Gesendet über das Kontaktformular von mk-stressfrei.sakalli.ai
</td></tr>
</table></body></html>`;

  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: env.MAIL_TO }],
    subject: `Anfrage von ${name}${plate ? ` (${plate})` : ''}`,
    htmlContent,
    textContent,
  };

  // Antwort geht an den Absender, sofern eine gültige Adresse vorliegt.
  if (email && isEmail(email)) {
    body.replyTo = { email, name: name || 'Besucher' };
  }

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Brevo-Fehler', response.status, detail.slice(0, 500));
      return json(502, 'Der Versand ist gerade nicht möglich. Bitte rufen Sie direkt an.');
    }
  } catch (error) {
    console.error('Brevo nicht erreichbar', error);
    return json(502, 'Der Versand ist gerade nicht möglich. Bitte rufen Sie direkt an.');
  }

  return json(200, 'Angekommen. Ich melde mich zeitnah bei Ihnen.');
}

/**
 * Ein einziger Einstiegspunkt, der selbst nach Methode verteilt.
 *
 * Waere nur `onRequestPost` exportiert, liefe ein GET auf diesen Pfad
 * in den statischen Fallback von Pages und bekaeme die Startseite mit
 * Status 200 zurueck. Das waere eine zweite indexierbare Kopie der
 * Seite unter /api/contact.
 */
export async function onRequest({ request, env }) {
  if (request.method === 'POST') return handleContact(request, env);

  return new Response(JSON.stringify({ ok: false, message: 'Nur POST erlaubt.' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Allow: 'POST',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
