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

Die Akzentfarbe stammt **aus dem Logo** (`brand/mkstress_logo_neu.png`):
ein Monogramm aus chromfarbenem M und kupfernem K unter einer
Fahrzeugsilhouette.

- **Navy** (`#04070f` bis `#b8c3dc`) als Flächenfarbe. Sie stammt nicht
  aus dem Logo, sondern trägt es. Das Logo ist für dunklen Grund
  gezeichnet, und ein kühler Untergrund trägt das warme Kupfer, ohne mit
  ihm zu streiten. Bewusst kein neutrales Grau, sondern ein Blau ins
  Tiefe gezogen, damit die Bildkacheln ruhig darauf stehen.
- **Kupfer** (`#dd7d38`) als einziger Akzent und Farbe aller primären
  Handlungsflächen. Es kommt aus dem K des Monogramms und hat auf dem
  dunklen Grund zwischen 7,4:1 und 9,4:1 Kontrast. Die dunkle Stufe
  `#a5561e` trägt die Auszeichnungen auf der hellen Kostensektion und
  kommt dort auf 5,0:1.
- **Bone** (`#f7f8fc`) für helle Flächen, leicht ins Blaue gezogen statt
  Reinweiß, damit der Bruch zur dunklen Seite nicht kalt wirkt.
- Das **Chrom** im Logo bekommt keine eigene Farbe. Dafür stehen Bone
  und `navy-300` bereits bereit.
- **WhatsApp-Grün** bleibt im Original. Nutzer erkennen die Farbe, ein
  umgefärbter Button verliert genau diesen Vorteil.

Beide Logodateien kommen mit Alphakanal, ein Freistellen entfällt.
`mkstress_logo_neu.png` bringt allerdings unter dem Motiv 221 Zeilen
deckendes Weiß über die volle Breite mit, ein Überbleibsel aus dem
Export. Auf der dunklen Seite stünde das als heller Riegel unter dem
Logo. `scripts/build-assets.mjs` erkennt und entfernt diesen Block,
statt ihn fest zu verdrahten: kommt die Datei später sauber nach,
passiert dort einfach nichts. Aus derselben Datei entstehen Favicon,
Touch-Icon und das Vorschaubild für soziale Netzwerke. Die Icon-Platte
ist dunkel, weil das Chrom des Logos auf hellem Grund verschwindet.

Schriften: **Archivo** für Überschriften (kräftige, leicht technische
Grotesk, passt zum Werkstattumfeld), **Inter** für Fließtext. Beide als
Variable Font lokal gebündelt, also keine Verbindung zu Google Fonts und
damit kein Drittlandthema.

## Der Opener

Zwei Fahrzeuge, Aufprall, Übergang zur Seite. Umgesetzt als **SVG plus
CSS-Keyframes**, dazu ein kurzlebiges Canvas für die Funken. Kein Video,
keine 3D-Szene.

Die Bildidee kommt aus dem Logo: das M ist Chrom, das K Kupfer, darüber
liegt eine Fahrzeuglinie. Also fährt von links ein Wagen in Chrom, von
rechts einer in Kupfer, beide als Lichtkontur im Stil dieser Linie
gezeichnet, mit Lichtspur, Scheinwerferkegel und Spiegelung auf der
Fahrbahn. Beim Aufprall gibt es Blitz, weiche Druckwelle, Funken mit
Schwerkraft und Abprall, Glassplitter und eine kurze Erschütterung. Aus
dem Licht wächst das Logo, ein Glanz fährt darüber, der Schriftzug
erscheint Buchstabe für Buchstabe. Danach fliegt das Logo in den Header,
und die Nacht öffnet sich kreisförmig zur Seite.

Gründe für diese Technik:

- Wenige Kilobyte statt mehrerer Megabyte.
- Gestochen scharf auf jedem Display, kein Codec-Thema, kein
  Autoplay-Problem auf iOS, keine Lizenzfrage.
- Die Funken laufen nur rund 1,5 Sekunden und das Canvas entfernt sich
  danach selbst.

Details, die man beim Umbau kennen muss:

- **Die Uhr startet mit der ersten CSS-Animation**, nicht mit dem
  Script. Der Browser beginnt Keyframes erst beim nächsten Zeichnen, das
  kann sich auf dem Handy um ein paar hundert Millisekunden verzögern.
  Ohne diese Kopplung flogen die Funken, bevor sich die Wagen berührten.
- **Das Intro-Logo ist nie `opacity: 0`**, verdeckt wird es allein über
  eine Maske. Für das Auge gleich, aber der Browser zählt es so ab dem
  ersten Bild als gezeichnet (LCP). Der Hero füllt den ganzen
  Bildschirm und gilt deshalb nicht als LCP-Kandidat.
- **Der Glanz nutzt keine Maske aus der Logodatei.** Eine CSS-Maske mit
  `url()` lädt das Bild im CORS-Modus ein zweites Mal. Das hat den
  mobilen Performance-Wert von 96 auf 91 gedrückt.
- Der Flug in den Header ist eine FLIP-Animation. Ziel und Quelle werden
  erst im Moment des Abflugs gesucht, weil das Script beim Parsen läuft
  und der Header dann noch nicht existiert.
- Das Overlay steht mit `hidden` im HTML und wird nur vom Inline-Script
  eingeblendet. Fällt JavaScript aus, ist sofort die Seite zu sehen.
- Läuft nur, wenn die Startseite die **erste Seite der Sitzung** ist
  (`mk-seen` in sessionStorage, von jeder Seite am Ende gesetzt) und nur
  einmal (`mk-intro`). `?intro` erzwingt ihn zum Vorführen.
  Überspringbar per Klick, Escape, Enter, Leertaste. Entfällt bei
  `prefers-reduced-motion`.

## Die Fahrt in der Ablauf-Sektion

Der Block bleibt beim Scrollen stehen, während das Fahrzeug die vier
Schritte abfährt. Runterscrollen schiebt es vorwärts, Hochscrollen
zurück. Sobald es beim vierten Punkt steht, gibt die Sektion frei und
die Seite läuft normal weiter.

Umgesetzt über `position: sticky` plus eine zusätzliche Scrollstrecke,
**nicht** über abgefangene Scroll-Ereignisse. Der Unterschied ist
wesentlich: Wer Scrollen abfängt, zerschießt Trackpad-Trägheit,
Tastaturbedienung, die Scrollleiste und das Verhalten auf Touch. Hier
bleibt alles nativ, aus der Position der Strecke wird lediglich ein
Fortschritt zwischen 0 und 1 abgeleitet.

Details, die daran hängen:

- **Die Fahrbahn endet in der Mitte des vierten Punktes**, nicht am
  Rand. Bei vier gleichen Spalten liegt diese Mitte 25 % vom rechten
  Rand entfernt, abzüglich dreier Viertel der Spaltenlücke und des
  halben Punktdurchmessers. So kommt das Fahrzeug genau dort zum Stehen.
- **Bewegt wird ein Läufer, nicht das Fahrzeug.** Der Läufer ist so
  breit wie die Fahrbahn, `translateX(100%)` entspricht also genau ihrer
  Länge. Der Umweg ist nötig, weil eine Animation von `left` den Browser
  in jedem Bild neu umbrechen lässt: In der Messung kamen so über zwei
  Sekunden Layoutarbeit und 640 ms Blockierzeit zusammen, mit
  `transform` sind es unter 150 ms.
- **`html { overflow-x: clip }` statt `overflow-x: hidden` am Body.**
  `hidden` macht das Element zum Scroll-Container und setzt damit
  `position: sticky` bei allen Nachfahren außer Kraft. `clip` schneidet
  ebenfalls ab, ohne einen Scroll-Container zu erzeugen.
- Auf schmalen Displays ist das Ganze abgeschaltet. Dort stehen die
  Schritte untereinander, eine waagerechte Fahrt ergäbe keinen Sinn.

Wie beim Opener stellt auch hier erst das Script den leeren
Startzustand her. Ohne JavaScript steht die Grafik fertig da statt leer.

## Einsatzgebiet-Karte

Selbst gezeichnetes SVG statt einer eingebetteten Karte. Jeder
Kartendienst lädt beim Aufruf Daten von einem Dritten und wäre damit
einwilligungspflichtig, die Seite käme also nicht mehr ohne
Cookie-Banner aus. Dazu kommen null zusätzliche Anfragen.

Die Orte stehen an ihrer ungefähr richtigen Stelle: Entfernung in
Kilometern und Peilung in Grad ab Ingolstadt liegen in `site.ts`, die
Karte rechnet daraus die Position. Der äußere Ring entspricht dem
gepflegten Einsatzradius, ändert sich `radiusKm`, zieht die Grafik mit.

## Zweistufiger Header

Am Seitenanfang ist der Header groß und ohne eigenen Hintergrund, er
liegt nur über dem Hero. Sobald gescrollt wird, schrumpft er auf etwa
zwei Drittel und legt sich hinterlegt über den Inhalt.

Der Hero zeigt oben hellen Himmel. Ohne Abdunklung stünden Logo und
Navigation dort ohne jeden Halt, deshalb liegt hinter dem Header ein
Verlauf, der über die Kopfhöhe hinaus ausklingt statt an der Unterkante
abzureißen. Dieser Verlauf braucht zwingend `z-index: -1`: Absolut
positionierte Pseudo-Elemente werden nach dem nicht positionierten
Inhalt des Elternelements gezeichnet, lägen also darüber und würden
Navigation und Schaltflächen mit abdunkeln. Am deutlichsten fällt das
am WhatsApp-Grün auf, das dann matt statt leuchtend wirkt.

Höhe und Logogröße hängen an denselben zwei Variablen (`--header-h`,
`--logo-h`), umgeschaltet über `data-scrolled` am `<html>`. Dadurch
ziehen Kopfhöhe, Logo, `scroll-padding-top` und der obere Abstand des
Heros gemeinsam nach, ohne dass irgendwo eine Zahl doppelt gepflegt wird.

## Seitenstruktur

Ursprünglich ein Onepager mit Dialogen. Auf Kundenwunsch und für die
Auffindbarkeit jetzt mehrseitig, die Startseite bleibt der Einstieg:

| Pfad                           | Inhalt                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| `/`                            | Startseite, alle Sektionen                                      |
| `/leistungen/`                 | „Welches Gutachten brauche ich?“, nach Lage sortiert            |
| `/leistungen/<slug>/`          | je Leistung eine Seite, Text in `src/content/leistungen/`       |
| `/kfz-gutachter/`              | Einsatzgebiet mit Fahrzeiten                                    |
| `/kfz-gutachter/<ort>/`        | je Ort eine Seite mit echter Route, Text in `src/content/orte/` |
| `/impressum/`, `/datenschutz/` | Rechtstexte                                                     |

Jede Unterseite hat eigenen Titel, Beschreibung, Canonical,
Brotkrümelnavigation und Schema.org (WebPage, Service, FAQPage,
BreadcrumbList). `robots.txt` und `llms.txt` werden beim Build aus
`astro.config.mjs` (`SITE`) erzeugt.

Ortsseiten nur für Orte, die wirklich angefahren werden, und jede mit
eigenen Daten (Entfernung, Fahrzeit, Strecke, Landkreis aus OSRM und
Nominatim). Austauschbare Stadtseiten mit getauschtem Ortsnamen wertet
Google als Doorway Pages ab.

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
- Der Reveal bewegt die Elemente nur, er blendet sie nicht ein. Während
  einer Deckkraft-Blende mischt der Browser Text- und Hintergrundfarbe,
  der Kontrast fällt kurzzeitig unter 4,5:1 und Prüfwerkzeuge messen
  genau diesen Zwischenstand. Mit reiner Verschiebung gilt immer der
  Ruhewert.
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

Das gilt auch für die Karte im Abschnitt „Über mich". Eine eingebettete
Karte, ob von Google oder von OpenStreetMap, lädt bei jedem Seitenaufruf
Kacheln von einem fremden Server und überträgt dabei die IP-Adresse des
Besuchers. Sie wäre damit einwilligungspflichtig. Stattdessen holt
`scripts/build-map.mjs` die Kacheln einmal beim Entwickeln, setzt sie
zusammen, färbt sie ein und legt das Ergebnis als Bild im Projekt ab.
Ausgeliefert wird ein gewöhnliches WebP vom eigenen Server. Marken und
Ringe liegen als SVG darüber; beide Seiten rechnen dieselbe Projektion
aus `src/data/map-config.mjs`, sonst lägen die Punkte neben den Orten.
Die von der ODbL geforderte Namensnennung steht sichtbar im Bild.

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

Gemessen mit Lighthouse gegen das gebaute `dist/`, ausgeliefert mit den
Headern aus `public/_headers` und mit Brotli, also unter denselben
Bedingungen wie bei Cloudflare. Ergebnis: Desktop 99/100/100/100, Mobil
98/100/100/100. Zahlen und Berichte in `docs/lighthouse/`.

Ein Testserver ohne Kompression misst hier deutlich zu pessimistisch:
Die Seite wiegt roh 187 KB, über die Leitung gehen 28 KB.

- CSS wird vollständig inline ausgeliefert (`inlineStylesheets: 'always'`).
  Spart auf jeder Seite einen render-blockierenden Request.
- Das Hero-Bild lädt mit `fetchpriority="high"`, alle übrigen Bilder mit
  `loading="lazy"`.
- Für Viewports unter 768 px gibt es einen eigenen Hochformat-Zuschnitt
  des Heros. Ohne ihn müsste ein 390-px-Display eine Querformatdatei
  laden, von der es den größten Teil wegschneidet.
- Icons sind Inline-SVG aus einem einheitlichen Set, keine Icon-Font,
  keine externe Bibliothek.
- Das Logo liegt als WebP mit Alphakanal vor, nicht als PNG. Es ist auf
  schmalen Displays das größte sichtbare Element und bestimmt damit den
  LCP. Als PNG waren es 60 KB, als WebP ein Bruchteil davon.
- Von den Schriften wird nur die aufrechte Gewichtsachse eingebunden
  (`wght.css`), nicht das komplette Paket mit Kursiven.
- Gesamtes clientseitiges JavaScript: rund 4 KB, aufgeteilt auf
  Scrollspy, Reveal, Sticky-CTA, Formular, Routenkarte und FAQ.

## Bekannte Grenzen

- Hero und Leistungskacheln sind mit Gemini erzeugte Bilder, die Prompts
  liegen in `docs/image-prompts.md`. Logo und Prüfsiegel sind echt.
  Eigene Fotos aus der Praxis wären auf Dauer stärker.
- Im Bereich „Über mich“ steht eine Visitenkarte ohne Foto. Ein echtes
  Porträt als `src/assets/portrait.jpg` ersetzt sie ohne Codeänderung.
- USt-IdNr. und Berufshaftpflicht erscheinen im Impressum nur, wenn sie
  in `site.ts` eingetragen sind (`vatId`, `liabilityInsurance`).
