# Übergabe

## 1. Was vor dem Go-Live fehlt

Nach Dringlichkeit sortiert. Punkt 1.1 bis 1.4 sind Pflicht, ohne sie
darf die Seite nicht unter einer eigenen Domain online gehen. Logo und
Visitenkarte liegen vor und sind eingebaut, siehe Abschnitt 1a.

### 1.1 Ladungsfähige Anschrift (Pflicht, § 5 DDG)

Ein Postfach reicht nicht. Eintragen in `src/data/site.ts`:

```ts
street: 'Musterstraße 12',
zip: '44575',
city: 'Castrop-Rauxel',
```

Sobald `city` gefüllt ist, greifen automatisch:

- die Adresse im Schema.org-Objekt, damit Google die Seite lokal einordnet,
- die Angabe des Einsatzgebiets in der Sektion „Über mich",
- alle ortsbezogenen Suchbegriffe im Text.

**Das ist der wichtigste Einzelpunkt der ganzen Liste.** Ohne Ort gibt es
keine lokale Sichtbarkeit, weder bei Google noch in KI-Antworten.

### 1.2 Steuernummer oder Umsatzsteuer-Identifikationsnummer (Pflicht)

```ts
taxId: 'USt-IdNr. DE123456789',
```

### 1.3 Berufshaftpflichtversicherung (Pflicht, wenn vorhanden)

In `src/components/LegalModals.astro` die Zeile
`[BITTE ERGÄNZEN: Name und Anschrift des Versicherers, räumlicher
Geltungsbereich]` ersetzen. Der Nachweis ist zugleich ein starkes
Vertrauenssignal und kann in die Vertrauensleiste aufgenommen werden.

### 1.4 Zuständige Datenschutz-Aufsichtsbehörde (Pflicht)

In `src/components/LegalModals.astro`, Abschnitt 9 der
Datenschutzerklärung. Zuständig ist die Behörde des Bundeslandes, in dem
das Unternehmen sitzt.

### 1.5 Namensreihenfolge prüfen

Auf der Visitenkarte steht „Kumalic Mersum". Genau so steht es auch auf
der Website, weil das die eigene Schreibweise des Kunden ist. Falls
„Kumalic" der Nachname ist und im Fließtext „Mersum Kumalic" richtiger
wäre: `owner` in `src/data/site.ts` ändern, die Seite zieht überall nach.

### 1.6 Weitere Qualifikationsnachweise

Auf der Seite steht die **DESAG-Prüfung**, belegt durch die Visitenkarte
(`brand/VK.png`). Sie erscheint im Hero, in der Vertrauensleiste und in
der Sektion „Über mich".

Weitere Nachweise gehören ebenfalls nach oben, sobald sie vorliegen.
Eintragen in `trustPoints` in `src/data/site.ts`:

- Öffentliche Bestellung und Vereidigung durch IHK oder Landgericht
- Zertifizierung nach DIN EN ISO/IEC 17024, etwa PersCert TÜV
- Mitgliedschaft BVSK oder BVS
- Jahre Berufserfahrung, etwa „Seit 2011 im Kfz-Sachverständigenwesen"
- Anzahl erstellter Gutachten, etwa „Über 2.000 Gutachten"

Nichts davon darf ohne Nachweis auf die Seite. Die Bezeichnung
„Sachverständiger" ist nicht geschützt, eine erfundene Bestellung oder
Mitgliedschaft wäre nach § 5 UWG irreführend und abmahnfähig.

### 1.7 Porträtfoto

In der Sektion „Über mich" steht ein Stimmungsbild. Ein echtes Foto von
Kumalic Mersum ist an dieser Stelle das stärkste Argument gegen ein
anonymes Großbüro. Aufnahmehinweise stehen in `docs/image-prompts.md`
unter Punkt 9. Datei als `src/assets/portrait.jpg` ablegen und in
`src/components/About.astro` den Import ändern.

### 1.8 Echte Bilder

Alle Bilder sind Platzhalter von Pexels. Fertige Prompts für eigene
Aufnahmen liegen in `docs/image-prompts.md`. Am wirkungsvollsten sind
eigene Fotos aus der täglichen Arbeit, weil sie unverwechselbar sind.

---

## 1a. Logo und Marke, bereits eingebaut

Die vier gelieferten Dateien liegen unverändert in `brand/`. Aus
`brand/Logo.png` erzeugt `node scripts/build-assets.mjs` alle
abgeleiteten Assets:

| Datei                         | Verwendung                     |
| ----------------------------- | ------------------------------ |
| `public/logo.png`             | Header, Footer, Opener         |
| `public/favicon-32.png`       | Browser-Tab                    |
| `public/apple-touch-icon.png` | Startbildschirm auf iOS        |
| `public/icon-512.png`         | Web-Manifest                   |
| `public/og.jpg`               | Vorschau beim Teilen von Links |

Der weiße Hintergrund wird dabei ausgeschlüsselt, das Logo sitzt ohne
hellen Rand auf dunklem Grund. Wird das Logo je ersetzt: neue Datei nach
`brand/Logo.png`, Skript laufen lassen, fertig. Weichen die neuen
Logofarben ab, zusätzlich `--color-navy-*`, `--color-royal-*` und
`--color-gold-*` in `src/styles/global.css` anpassen. Die gesamte Seite
zieht nach, weil kein Farbwert hart im Markup steht.

`LogoFirma.png` und `LogoMitTitel.png` enthalten dieselbe Marke mit
Schriftzügen. Auf Header-Höhe skaliert wären diese Schriftzüge
unleserlich, deshalb steht der Name auf der Website als echter Text
neben dem Bildzeichen. Das ist zugleich besser für Suchmaschinen.

## 2. Inhalte pflegen

Fast alles steht in **`src/data/site.ts`**. Nach jeder Änderung:

```bash
npm run build
npx wrangler pages deploy dist --project-name mk-stressfrei --branch main
```

| Was ändern              | Wo in `site.ts`  |
| ----------------------- | ---------------- |
| Telefon, E-Mail         | `company`        |
| Erreichbarkeit          | `company.hours`  |
| Vertrauensmerkmale      | `trustPoints`    |
| Leistungen und Details  | `services`       |
| Checkliste Unfallstelle | `emergencySteps` |
| Ablaufschritte          | `processSteps`   |
| Häufige Fragen          | `faqs`           |
| Titel, Beschreibung     | `seo`            |

Neue FAQ-Einträge landen automatisch im FAQPage-Schema. Neue Leistungen
brauchen zusätzlich ein Bild in `src/assets/` und einen Eintrag in der
Zuordnung `covers` in `src/components/Services.astro`.

Die Reihenfolge der Sektionen steht in `src/pages/index.astro`, die
Navigationspunkte in `nav` in `site.ts`. Beide müssen zusammenpassen,
sonst zeigt der Scrollspy ins Leere.

---

## 3. E-Mail-Versand einrichten

Der Versand läuft über Brevo. Das Konto und die Versanddomain
`send.sakalli.ai` bestehen bereits, es muss nichts neu verifiziert werden.

```bash
export CLOUDFLARE_ACCOUNT_ID=a7d1c1d85a13c87fb28daee24d791d35

# Secret, wird interaktiv abgefragt
npx wrangler pages secret put BREVO_API_KEY --project-name mk-stressfrei
```

Dazu im Cloudflare-Dashboard unter Workers & Pages → mk-stressfrei →
Settings → Variables and Secrets zwei normale Variablen anlegen:

| Name        | Wert                                      |
| ----------- | ----------------------------------------- |
| `MAIL_FROM` | `MK Stressfrei <anfrage@send.sakalli.ai>` |
| `MAIL_TO`   | zunächst `emosa7758@gmail.com`            |

**`MAIL_TO` bleibt bis zum Go-Live auf der Testadresse.** Erst wenn alles
geprüft ist, auf `vato-bosna@web.de` umstellen, und danach keine
Testanfrage mehr absenden.

Ohne diese Variablen zeigt das Formular eine verständliche Fehlermeldung
und verweist auf Telefon und WhatsApp. Es bricht also nichts.

### Optional: Turnstile

Erst nötig, wenn tatsächlich Spam ankommt. Honeypot, Zeitprüfung und
Rate-Limit greifen schon jetzt.

1. Im Cloudflare-Dashboard unter Turnstile eine Site anlegen.
2. Site-Key als Build-Variable `PUBLIC_TURNSTILE_SITE_KEY` setzen.
3. `npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name mk-stressfrei`
4. Neu bauen und deployen. Das Widget erscheint dann automatisch im
   Formular und wird serverseitig geprüft.

### Optional: hartes Rate-Limit

Das aktuelle Limit liegt im Arbeitsspeicher und überlebt keinen
Isolate-Wechsel. Für das erwartete Volumen reicht das. Wer es strenger
will:

```bash
npx wrangler kv namespace create RATE_LIMIT
```

Die zurückgegebene ID in `wrangler.toml` als Binding eintragen und in
`functions/api/contact.js` die Funktion `rateLimited` auf
`env.RATE_LIMIT.get/put` mit TTL umstellen.

---

## 4. Go-Live auf die Kundendomain

Die Domain bleibt beim bisherigen Anbieter. **Keine Nameserver-Migration,
MX-, SPF-, DKIM- und DMARC-Einträge nicht anfassen**, sonst steht das
E-Mail-Postfach des Kunden still.

**Schritt 1, beim Domain-Anbieter (Strato, IONOS, Hetzner):**

```
CNAME   www   mk-stressfrei.pages.dev
```

Dazu eine Weiterleitung der Domain ohne www auf `https://www.domain.de`.
Diese Funktion heißt bei den Anbietern meist „Domainweiterleitung" oder
„HTTP-Redirect".

**Schritt 2, im Cloudflare-Dashboard:**

Workers & Pages → mk-stressfrei → Custom domains → `www.domain.de`
hinzufügen. Das Zertifikat stellt Cloudflare automatisch aus, das dauert
einige Minuten.

**Schritt 3, im Code:**

In `astro.config.mjs` die Konstante `SITE` auf die neue Domain setzen.
Das aktualisiert Canonical-URL, Sitemap, Open-Graph-URLs und die
Schema.org-Kennungen in einem Zug. Danach in `public/robots.txt` die
Sitemap-Adresse anpassen.

**Schritt 4, Doppelinhalte vermeiden:**

Umgebungsvariable `CANONICAL_HOST` auf `www.domain.de` setzen. Die
Middleware in `functions/_middleware.js` leitet dann alle Aufrufe von
`*.pages.dev` per 301 auf die Kundendomain um.

**Schritt 5:** `MAIL_TO` auf `vato-bosna@web.de` umstellen, neu bauen und
deployen.

---

## 5. Wiederkehrende Aufgaben

| Wie oft         | Was                                                                              |
| --------------- | -------------------------------------------------------------------------------- |
| Monatlich       | `npm audit` und `npm outdated` prüfen                                            |
| Vierteljährlich | Kontaktformular mit einer Testmail an `emosa7758@gmail.com` prüfen               |
| Vierteljährlich | Rechtstexte gegen aktuelle Rechtslage abgleichen                                 |
| Bei Änderungen  | Telefonnummer und Erreichbarkeit in `site.ts` und im Google-Profil gleich halten |

Backup: das Git-Repository ist das Backup. Die Seite ist vollständig
statisch, es gibt keine Datenbank.

Empfohlen: kostenloser Uptime-Check bei UptimeRobot auf die Startseite,
Intervall fünf Minuten.

---

## 6. Nach dem Go-Live

**Google-Unternehmensprofil anlegen.** Bringt für einen lokalen
Dienstleister mehr Anfragen als jede Optimierung an der Website selbst.
Voraussetzung ist die Adresse aus Punkt 1.1. Name, Telefonnummer und
Adresse müssen mit der Website zeichengenau übereinstimmen.

**Search Console verbinden** und `sitemap-index.xml` einreichen.

**Erste echte Bewertungen sammeln.** Zwei Sätze von zufriedenen Mandanten
im Google-Profil wirken stärker als jede Formulierung auf der Seite. Ist
die Sammlung gestartet, lohnt sich eine Bewertungssektion auf der Seite.

**Analytics:** derzeit bewusst nicht eingebaut, deshalb kein
Cookie-Banner. Wer Zahlen braucht, nimmt Cloudflare Web Analytics: ohne
Cookies, ohne Einwilligung, im Dashboard mit einem Klick aktivierbar.
Dann in `src/components/LegalModals.astro` Abschnitt 5 der
Datenschutzerklärung ergänzen.
