/**
 * Liefert `dist/` mit exakt den Headern aus `public/_headers` aus.
 *
 * Zweck: die Content-Security-Policy im Browser gegenprüfen. Genau sie
 * ist der häufigste Grund dafür, dass eine Seite nach dem Deploy nur
 * den Hero zeigt, weil sie die eigenen Inline-Scripts blockiert. Ein
 * reiner Abruf per curl kann das nicht aufdecken.
 *
 * Aufruf: node scripts/serve-prod.mjs [port]
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompress, gzip } from 'node:zlib';
import { promisify } from 'node:util';

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

/** Textformate komprimieren, so wie Cloudflare es auch tut. Ohne das
 *  misst ein Performance-Test deutlich zu pessimistisch. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest))/;

const PORT = Number(process.argv[2] ?? 4322);
const ROOT = 'dist';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

/** Liest den globalen `/*`-Block aus public/_headers. */
async function globalHeaders() {
  const raw = await readFile('public/_headers', 'utf8');
  const headers = {};
  let inGlobal = false;

  for (const line of raw.split('\n')) {
    if (!line.startsWith(' ') && line.trim() !== '') {
      inGlobal = line.trim() === '/*';
      continue;
    }
    if (!inGlobal) continue;
    const match = /^\s+([A-Za-z-]+):\s*(.+)$/.exec(line);
    if (match?.[1] && match[2]) headers[match[1]] = match[2];
  }

  return headers;
}

const headers = await globalHeaders();
console.log(`Header aus _headers übernommen: ${Object.keys(headers).join(', ')}`);

createServer(async (request, response) => {
  const path = new URL(request.url ?? '/', 'http://x').pathname;
  // Verhindert Ausbrechen aus dem Ausgabeverzeichnis.
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, safe.endsWith('/') ? `${safe}index.html` : safe);

  try {
    let body = await readFile(file);
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    const accept = String(request.headers['accept-encoding'] ?? '');
    const extra = {};

    if (COMPRESSIBLE.test(type)) {
      if (accept.includes('br')) {
        body = await brotli(body);
        extra['Content-Encoding'] = 'br';
      } else if (accept.includes('gzip')) {
        body = await gz(body);
        extra['Content-Encoding'] = 'gzip';
      }
      extra['Vary'] = 'Accept-Encoding';
    }

    response.writeHead(200, { ...headers, ...extra, 'Content-Type': type });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('404');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Produktionsnahe Auslieferung auf http://127.0.0.1:${PORT}`);
});
