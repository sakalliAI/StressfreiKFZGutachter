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

Der Übergang am Ende ist eine FLIP-Animation: Das Script misst die
Position des Header-Logos, rechnet Verschiebung und Maßstab aus und
schiebt das Bildzeichen des Openers genau dorthin.

Wichtig dabei: Der Opener steht im Dokument **vor** dem Header, und sein
Script läuft inline beim Parsen. Beide Elemente dürfen deshalb erst im
Moment des Abflugs gesucht werden, nicht beim Start. Andernfalls ist das
Ziel schlicht noch nicht da, die Suche liefert `null` und der Flug fällt
lautlos aus, während der Rest der Sequenz normal weiterläuft. Aus
demselben Grund wird das Header-Logo nicht direkt ausgeblendet, sondern
über eine Klasse am `<html>`. Das echte Header-Logo
ist währenddessen ausgeblendet und erscheint erst, wenn das Overlay
verschwindet. Feste Pixelwerte müssten für jede Bildschirmbreite neu
gepflegt werden und wären beim nächsten Umbau der Kopfzeile wieder falsch.

Die Fläche gibt die Seite bewusst erst mit dem Abflug des Logos frei.
Stünde die Marke über der bereits sichtbaren Seite, wirkte sie wie ein
Fremdkörper mitten im Hero statt wie ein eigener Auftritt. Der Preis
dafür sind rund 0,3 Sekunden beim mobilen LCP, 2,7 statt 2,4. Ab dem
zweiten Aufruf der Sitzung entfällt der Opener ohnehin.

Umgekehrte Sichtbarkeitslogik: Das Overlay steht mit `hidden` im HTML und
wird nur von einem Inline-Skript eingeblendet. Fällt JavaScript aus, ist
sofort die Seite zu sehen. Andersherum könnte ein Skriptfehler die
gesamte Seite hinter einer schwarzen Fläche verstecken. Der Opener läuft
einmal pro Browsersitzung, ist jederzeit überspringbar und entfällt bei
`prefers-reduced-motion` vollständig.

Alternativen mit Veo 3 oder fertigen 3D-Modellen: siehe `docs/opener.md`.

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
  Bei einem Onepager spart das einen render-blockierenden Request.
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
  Scrollspy, Dialoge, Reveal, Sticky-CTA und Formular.

## Bekannte Grenzen

- Hero und Leistungskacheln sind mit Gemini erzeugte Bilder, die Prompts
  liegen in `docs/image-prompts.md`. Logo und Prüfsiegel sind echt.
  Eigene Fotos aus der Praxis wären auf Dauer stärker.
- Im Bereich „Über mich" steht ein Stimmungsbild, kein Porträt. Ein
  echtes Foto von Mersum Kumalic ersetzt es ohne Codeänderung.
- Adresse, Steuernummer, Berufshaftpflicht und Aufsichtsbehörde in den
  Rechtstexten sind mit `[BITTE ERGÄNZEN]` markiert und müssen vor dem
  Go-Live gefüllt werden.
