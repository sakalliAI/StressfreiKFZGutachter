# Architektur und Entscheidungen

## Ausgangslage

Ein Einzelunternehmer im Kfz-Sachverständigenwesen braucht eine Website.
Die Zielgruppe sind zu rund 80 Prozent Privatpersonen kurz nach einem
Unfall, häufig mit dem Handy und unter Stress. Der Kunde nennt WhatsApp
als seinen Hauptkanal und wünscht sich einen auffälligen Einstieg mit
Bewegung.

Daraus folgen drei Leitplanken, an denen sich jede Entscheidung misst:

1. Auf dem Handy muss der Weg zur Kontaktaufnahme unter drei Sekunden liegen.
2. Die Seite muss auch bei schlechter Mobilverbindung sofort etwas zeigen.
3. Kein Versprechen darf über das hinausgehen, was belegbar ist.

## Stack

| Baustein     | Wahl                           | Begründung                                                                                                                                      |
| ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | Astro 7 (`output: 'static'`)   | Statische Marketing-Seite ohne Anwendungslogik. Astro liefert reines HTML aus und verschickt nur die wenigen Interaktions-Skripte, die es gibt. |
| Styling      | Tailwind CSS 4 via Vite-Plugin | Design-Tokens direkt in CSS (`@theme`), kein JS-Konfigurationslayer, kein PostCSS-Aufbau.                                                       |
| Sprache      | TypeScript, `strict`           | Inhalte liegen typisiert in einer Datei, Tippfehler fallen beim Build auf.                                                                      |
| Hosting      | Cloudflare Pages               | Vorgabe. Statisches Edge-Hosting plus Functions für das Formular, ohne separaten Server.                                                        |
| Formularmail | Brevo über Pages Function      | EU-Server, AVV nach Art. 28 DSGVO. Der API-Key bleibt serverseitig.                                                                             |
| Bilder       | `astro:assets` mit sharp       | Erzeugt WebP in mehreren Breiten zur Buildzeit, inklusive eigenem Hochformat-Zuschnitt fürs Handy.                                              |

Verworfen: **Next.js** (SSR ohne Nutzen, größerer Client-Anteil),
**React SPA** (schlechter für SEO, unnötige Hydration),
**CMS** (ein Einzelunternehmer mit sechs Leistungen pflegt schneller eine
TypeScript-Datei als ein Redaktionssystem, das Geld kostet und gewartet
werden will).

## Farben und Typografie

Die Palette stammt **direkt aus dem Logo** (`brand/Logo.png`): ein
Monogramm aus königsblauem M und goldenem K, eingefasst in eine
Fahrzeugsilhouette.

- **Navy** (`#04070f` bis `#b8c3dc`) als Flächenfarbe. Bewusst kein
  neutrales Grau, sondern dasselbe Blau ins Tiefe gezogen. Dadurch wirkt
  das Logo eingebettet statt aufgeklebt, und die Bildkacheln stehen
  ruhig darauf.
- **Gold** (`#d9a32b`) als einziger Akzent und Farbe aller primären
  Handlungsflächen. Es kommt aus dem K des Monogramms und hat auf dem
  dunklen Grund rund 8:1 Kontrast.
- **Royal** (`#0b3a9e`) ist das Logoblau in Textstärke. Es trägt die
  Auszeichnungen auf der hellen Kostensektion, wo Gold nur rund 1,9:1
  erreichen würde.
- **Bone** (`#f7f8fc`) für helle Flächen, leicht ins Blaue gezogen statt
  Reinweiß, damit der Bruch zur dunklen Seite nicht kalt wirkt.
- **WhatsApp-Grün** bleibt im Original. Nutzer erkennen die Farbe, ein
  umgefärbter Button verliert genau diesen Vorteil.
- Das **Rot** der Rücklichter im Logo bleibt dem Logo vorbehalten. Als
  Flächenfarbe liegt es zu nah an einer Fehlermeldung.

Das Logo wurde auf weißem Grund geliefert. Ein einfaches Ausschlüsseln
der weißen Pixel hinterlässt an den weichgezeichneten Kanten einen
hellen Halo, der auf dunklem Untergrund sofort auffällt.
`scripts/build-assets.mjs` leitet stattdessen die Deckkraft aus dem
hellsten Kanal ab und rechnet die Farbe gegen Weiß zurück. Das
funktioniert hier, weil beide Markenfarben jeweils einen Kanal nahe null
haben. Aus derselben Datei entstehen Favicon, Touch-Icon und das
Vorschaubild für soziale Netzwerke.

Schriften: **Archivo** für Überschriften (kräftige, leicht technische
Grotesk, passt zum Werkstattumfeld), **Inter** für Fließtext. Beide als
Variable Font lokal gebündelt, also keine Verbindung zu Google Fonts und
damit kein Drittlandthema.

## Der Opener

Der Kunde wünscht sich einen Einstieg mit zwei Fahrzeugen, die
kollidieren, und einem Übergang zur Seite. Umgesetzt als **SVG plus
CSS-Keyframes**, nicht als Video und nicht als 3D-Szene.

Gründe:

- Rund 6 KB statt mehrerer Megabyte. Ein Video hätte den größten
  Ladeposten der Seite gestellt, ausgerechnet für Besucher am Straßenrand.
- Gestochen scharf auf jedem Display, kein Reencoding, kein Codec-Thema.
- Kein Autoplay-Problem auf iOS, keine Lizenzfrage bei Stockmaterial.
- Der LCP der Seite bleibt das Hero-Bild. Der Opener liegt darüber und
  hält den Messwert nicht auf.

Umgekehrte Sichtbarkeitslogik: Das Overlay steht mit `hidden` im HTML und
wird nur von einem Inline-Skript eingeblendet. Fällt JavaScript aus, ist
sofort die Seite zu sehen. Andersherum könnte ein Skriptfehler die
gesamte Seite hinter einer schwarzen Fläche verstecken. Der Opener läuft
einmal pro Browsersitzung, ist jederzeit überspringbar und entfällt bei
`prefers-reduced-motion` vollständig.

Alternativen mit Veo 3 oder fertigen 3D-Modellen: siehe `docs/opener.md`.

## Warum ein Onepager

Sechs Leistungen und ein Ansprechpartner rechtfertigen keine
Unterseitenstruktur. Ein durchgehender Scroll mit Ankern hält den
Besucher im Fluss und vermeidet Ladezeiten zwischen Seiten. Details zu
den Leistungen und die Rechtstexte liegen in `<dialog>`-Overlays: der
Text steht real im HTML, ist also für Suchmaschinen und Sprachmodelle
lesbar, kostet aber keinen Seitenwechsel.

## Scrollspy

Die aktive Sektion wird **positionsbasiert** bestimmt: aktiv ist die
letzte Sektion, deren Oberkante noch oberhalb der Header-Unterkante liegt
(`Header.astro`). Eine reine Sichtbarkeitsprüfung per
IntersectionObserver markiert beim Hochscrollen fälschlich die erste
sichtbare Sektion. Zwei Sonderfälle sind gesondert behandelt: ganz oben
ist nichts aktiv, ganz unten immer die letzte Sektion, damit der kurze
Kontaktblock nicht übersprungen wird. Aktualisiert wird gedrosselt über
`requestAnimationFrame`, zusätzlich bei `resize`.

## Sichtbarkeit ohne JavaScript

Scroll-Reveal-Animationen sind ein häufiger Grund für Seiten, die nach
dem Deploy unterhalb des Heros leer bleiben. Deshalb:

- Die Startwerte (`opacity: 0`) greifen erst über die Klasse
  `js-reveal-ready`, die das Layout-Skript am `<html>` setzt. Ohne
  Skript ist alles sichtbar.
- Zusätzlich blendet ein Timeout nach 2,5 Sekunden alles hart ein, falls
  der IntersectionObserver aus irgendeinem Grund nicht auslöst.
- Die CSP in `public/_headers` erlaubt `'unsafe-inline'` für Skripte und
  Styles. Ohne diese Freigabe blockiert der Browser genau die Skripte,
  die Sektionen sichtbar machen.

## Kontaktformular

Ablauf: Browser sendet JSON an `/api/contact`, die Pages Function prüft
und schickt die Mail über Brevo.

Spamschutz in vier Stufen, bewusst ohne Pflicht-Captcha:

1. **Honeypot** (`website`), ausgeblendet über Positionierung statt
   `display: none`, weil verbreitete Bots Letzteres erkennen.
2. **Zeitprüfung**: Absenden unter drei Sekunden nach Seitenaufruf wird
   verworfen.
3. **Rate-Limit** pro IP, fünf Anfragen in zehn Minuten.
4. **Turnstile**, optional. Sobald `TURNSTILE_SECRET_KEY` gesetzt ist,
   wird serverseitig geprüft.

Das Rate-Limit liegt im Arbeitsspeicher der Isolate und überlebt keinen
Isolate-Wechsel. Für den erwarteten Anfragevolumen eines
Einzelunternehmers reicht das. Der Weg zu harten Garantien über einen
KV-Namespace steht in `docs/handover.md`.

Alle Nutzereingaben werden von Steuerzeichen befreit, längenbegrenzt und
für die HTML-Mail escaped. Zeilenumbrüche in Name und E-Mail werden
abgewiesen, damit über den Reply-To-Header nichts eingeschleust wird.

## Datenschutz ohne Bannerklick

Die Seite setzt keine Analyse- oder Marketing-Cookies und bindet keine
Drittanbieter-Skripte ein. Damit entfällt die Einwilligungspflicht nach
§ 25 TDDDG und es braucht kein Consent-Banner. Das ist zugleich die
schnellste Variante: kein blockierendes Skript, kein Layout-Sprung, kein
Klick vor dem ersten Inhalt.

Der einzige clientseitige Speicherzugriff ist ein Merker im
`sessionStorage`, damit der Opener nur einmal je Sitzung läuft. Er
enthält keine personenbezogenen Daten und ist in der
Datenschutzerklärung benannt.

## Aussagen, die bewusst fehlen

Die Bezeichnung „Sachverständiger" ist in Deutschland nicht geschützt.
Genau deshalb sind Qualifikationsnachweise das stärkste Vertrauenssignal
der Branche, und genau deshalb dürfen sie nicht erfunden werden. Eine
behauptete öffentliche Bestellung, TÜV-Zertifizierung oder
BVSK-Mitgliedschaft wäre eine irreführende geschäftliche Handlung nach
§ 5 UWG und abmahnfähig.

Genannt wird deshalb ausschließlich die **DESAG-Prüfung**, die durch die
Visitenkarte des Kunden belegt ist (`brand/VK.png`). Sie steht im
Hero-Chip, in der Vertrauensleiste und im Fließtext der Sektion „Über
mich". Alles Weitere in der Leiste sind Aussagen über das
Geschäftsmodell, die ohne Nachweis zutreffen: Unabhängigkeit, ein
Ansprechpartner, Vor-Ort-Termin, Weiterleitung an Versicherung und
Anwalt. Felder für weitere Nachweise sind vorbereitet und in
`docs/handover.md` gelistet.

Gleiches gilt für den Ort: solange `company.city` auf `null` steht,
rendert die Seite eine neutrale Formulierung und das Schema.org-Objekt
lässt Adresse und Einsatzgebiet weg. Ein strukturiertes Datum mit
Platzhaltertext wäre schlechter als keins.

## Performance

- CSS wird vollständig inline ausgeliefert (`inlineStylesheets: 'always'`).
  Bei einem Onepager spart das einen render-blockierenden Request.
- Das Hero-Bild lädt mit `fetchpriority="high"`, alle übrigen Bilder mit
  `loading="lazy"`.
- Für Viewports unter 768 px gibt es einen eigenen Hochformat-Zuschnitt
  des Heros. Ohne ihn müsste ein 390-px-Display eine Querformatdatei
  laden, von der es den größten Teil wegschneidet.
- Icons sind Inline-SVG aus einem einheitlichen Set, keine Icon-Font,
  keine externe Bibliothek.
- Gesamtes clientseitiges JavaScript: rund 4 KB, aufgeteilt auf
  Scrollspy, Dialoge, Reveal, Sticky-CTA und Formular.

## Bekannte Grenzen

- Die Bilder sind Platzhalter von Pexels. Prompts für eigene Aufnahmen
  liegen in `docs/image-prompts.md`. Das Logo ist echt.
- Im Bereich „Über mich" steht ein Stimmungsbild, kein Porträt. Ein
  echtes Foto von Mersum Kumalic ersetzt es ohne Codeänderung.
- Adresse, Steuernummer, Berufshaftpflicht und Aufsichtsbehörde in den
  Rechtstexten sind mit `[BITTE ERGÄNZEN]` markiert und müssen vor dem
  Go-Live gefüllt werden.
