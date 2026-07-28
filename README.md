# MK Stressfrei KFZ Gutachter

Website für Mersum Kumalic, Kfz-Sachverständiger. Onepager auf Astro,
gehostet auf Cloudflare Pages, Kontaktformular über Brevo.

Vorschau: https://mk-stressfrei.sakalli.ai

## Schnellstart

```bash
npm install
npm run dev          # http://localhost:4321
```

## Befehle

| Befehl              | Wirkung                               |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Entwicklungsserver mit Hot Reload     |
| `npm run build`     | Produktionsbuild nach `dist/`         |
| `npm run preview`   | Buildergebnis lokal ausliefern        |
| `npm run typecheck` | `astro check`, muss 0 Fehler melden   |
| `npm run lint`      | ESLint über JS, TS und Astro          |
| `npm run format`    | Prettier über das ganze Projekt       |
| `npm run deploy`    | Build und Deploy auf Cloudflare Pages |

Zusätzlich:

```bash
node scripts/build-assets.mjs   # Logo freistellen, Icons und OG-Bild erzeugen
node scripts/build-map.mjs      # Kartenbild fuer das Einsatzgebiet erzeugen (holt OSM-Kacheln)
node scripts/shots.mjs          # Sichtprüfung Desktop und Mobil, prüft auch den Scrollspy
node scripts/serve-prod.mjs     # dist/ mit echten Headern und Brotli ausliefern (Port 4322)
```

## Projektstruktur

```
src/
  data/site.ts        Alle Inhalte und Stammdaten an einer Stelle
  components/         Eine Datei pro Sektion
  layouts/Layout.astro  Head, Schema.org, globale Scripts
  pages/index.astro   Reihenfolge der Sektionen
  styles/global.css   Design-Tokens und wiederkehrende Klassen
  assets/             Bilder, laufen durch die Astro-Bildpipeline
brand/                Originaldateien des Kunden (Logo, Visitenkarte)
functions/            Cloudflare Pages Functions
public/               Statische Dateien, _headers, robots.txt
                      logo.png und die Icons entstehen aus brand/
docs/                 Recherche, Bildprompts, Übergabe
```

Inhalte ändern: in aller Regel reicht `src/data/site.ts`.

## Umgebungsvariablen

| Name                        | Wo            | Pflicht | Zweck                                                            |
| --------------------------- | ------------- | ------- | ---------------------------------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build (Astro) | nein    | Blendet das Turnstile-Widget im Formular ein                     |
| `BREVO_API_KEY`             | Pages Secret  | ja      | Versand der Formularmails über Brevo                             |
| `MAIL_FROM`                 | Pages Env     | ja      | Absender, Format `Name <adresse@send.sakalli.ai>`                |
| `MAIL_TO`                   | Pages Env     | ja      | Empfänger der Anfragen                                           |
| `TURNSTILE_SECRET_KEY`      | Pages Secret  | nein    | Aktiviert die serverseitige Turnstile-Prüfung                    |
| `CANONICAL_HOST`            | Pages Env     | nein    | Erst zum Go-Live. Leitet `*.pages.dev` per 301 auf die Domain um |

Secrets setzen (Werte werden interaktiv abgefragt, nie im Repo ablegen):

```bash
export CLOUDFLARE_ACCOUNT_ID=a7d1c1d85a13c87fb28daee24d791d35
npx wrangler pages secret put BREVO_API_KEY --project-name mk-stressfrei
```

Normale Variablen setzt man im Cloudflare-Dashboard unter
Workers & Pages → mk-stressfrei → Settings → Variables and Secrets.

## Deployment

```bash
export CLOUDFLARE_ACCOUNT_ID=a7d1c1d85a13c87fb28daee24d791d35
npm run build
npx wrangler pages deploy dist --project-name mk-stressfrei --branch main
```

`_headers` und `_redirects` liegen in `public/` und landen automatisch
in `dist/`. Die Pages Functions unter `functions/` werden von Wrangler
mit hochgeladen.

## Qualitätssicherung

```bash
npm run build
node scripts/serve-prod.mjs 4323          # produktionsnah, mit _headers und Brotli
node scripts/shots.mjs http://127.0.0.1:4323   # Rendering, Konsole, Scrollspy, Überlauf
```

`serve-prod.mjs` liefert `dist/` mit exakt den Headern aus
`public/_headers` aus. Damit lässt sich prüfen, ob die
Content-Security-Policy die eigenen Inline-Scripts blockiert. Genau das
ist der häufigste Grund für Seiten, die nach dem Deploy nur den Hero
zeigen, und ein Abruf per curl deckt es nicht auf.

Aktuelle Lighthouse-Werte und die vollständigen Berichte:
`docs/lighthouse/`.

## Sicherheit und Datenschutz

- Keine Cookies, kein Tracking, deshalb auch kein Einwilligungsbanner.
- Schriften liegen lokal im Bundle, keine Anfrage an Google Fonts.
- Security-Header inklusive CSP in `public/_headers`.
- Formular: Honeypot, Zeitprüfung, Rate-Limit, optional Turnstile.
- Impressum und Datenschutz öffnen als Overlay, der Text steht im HTML.

Details und offene Punkte: `docs/handover.md`.
