# Lighthouse-Ergebnisse

Gemessen am 28. Juli 2026 (nach dem Umbau von Opener und Header) gegen das gebaute `dist/` mit exakt den
Headern aus `public/_headers` und mit Brotli-Kompression, also unter
denselben Bedingungen wie bei Cloudflare Pages.

Reproduzieren:

```bash
npm run build
node scripts/serve-prod.mjs 4323
CHROME_PATH=<pfad-zu-chrome> npx lighthouse@12 http://127.0.0.1:4323/ \
  --preset=desktop --output=html --output-path=docs/lighthouse/desktop.html
```

| Kategorie      | Desktop | Mobil |
| -------------- | ------- | ----- |
| Performance    | 100     | 96    |
| Accessibility  | 100     | 100   |
| Best Practices | 100     | 100   |
| SEO            | 100     | 100   |

## Core Web Vitals

| Messwert | Desktop | Mobil | Zielwert |
| -------- | ------- | ----- | -------- |
| LCP      | 0.7 s   | 2.7 s | < 2,5 s  |
| CLS      | 0       | 0.001 | < 0,1    |
| TBT      | 0 ms    | 30 ms | < 200 ms |
| FCP      | 0.3 s   | 1.4 s |          |

Die Mobilmessung läuft mit der Standarddrosselung von Lighthouse
(langsames 4G, gedrosselte CPU) und beim ersten Aufruf der Sitzung,
also inklusive des vollständigen Openers. Der hält die Seite bis zum
Logo-Flug verdeckt, was den mobilen LCP knapp über die 2,5-Sekunden-Marke
schiebt. Das ist der bewusst in Kauf genommene Preis für den Auftritt.
Ab dem zweiten Aufruf der Sitzung entfällt der Opener und der Wert
liegt deutlich darunter.

Die vollständigen Berichte liegen als `desktop.html` und `mobil.html`
daneben.
