# Der Opener: was gebaut wurde und welche Alternativen es gibt

Der Wunsch war ein Einstieg mit zwei Fahrzeugen, die einen Unfall
verursachen, und einem Übergang zur Website. Dazu die Frage, ob man das
mit Veo 3 als Video bauen sollte, 3D-Modelle besorgen oder Stockmaterial
verwenden.

## Was jetzt drin ist

Eine in SVG und CSS gebaute Sequenz, rund 2,7 Sekunden lang:

| Zeit        | Was passiert                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------- |
| 0,0 – 0,2 s | Die Fahrbahnlinie zieht sich auf                                                               |
| 0,2 – 1,1 s | Zwei Fahrzeuge beschleunigen aus dem Bild heraus aufeinander zu, Scheinwerferkegel wachsen mit |
| 1,1 s       | Aufprall. Weißer Blitz, zwei Schockwellen, sechzehn Splitter, beide Fahrzeuge federn zurück    |
| 1,3 – 2,0 s | Fahrzeuge lösen sich auf, die Marke tritt an ihre Stelle                                       |
| 2,0 – 2,7 s | Die Fläche teilt sich waagerecht und gibt die Seite frei                                       |

Eigenschaften:

- Rund 6 KB. Ein vergleichbares Video liegt bei 2 bis 8 MB.
- Vektorbasiert, also auf jedem Display gestochen scharf.
- Läuft **einmal pro Browsersitzung**. Beim Neuladen bleibt er weg, weil
  er bis zum Ende den Inhalt verdeckt und sonst jedes Mal den ersten
  Bildaufbau verzögern würde.
- Zum Vorführen: **`?intro` an die Adresse hängen**, dann läuft er
  wieder, also `https://mk-stressfrei.sakalli.ai/?intro`. Ein neuer Tab
  oder ein privates Fenster tut es auch.
- Jederzeit überspringbar: Schaltfläche oben rechts, Klick irgendwohin,
  Escape, Enter oder Leertaste.
- Entfällt vollständig, wenn im Betriebssystem reduzierte Bewegung
  eingestellt ist.
- Kein Autoplay-Problem auf iPhones und keine Lizenzfrage.

Die Darstellung ist bewusst abstrakt gehalten: geometrische Silhouetten,
kein realistisches Blech, keine Personen. Ein fotorealistischer Crash am
Anfang einer Seite, die Unfallgeschädigte aufrufen, wäre geschmacklos.
Der Aufprall ist als Lichtereignis inszeniert, nicht als Unglück.

## Wenn es doch ein Video sein soll

Möglich ist das. Der Einbauort ist vorbereitet: In
`src/components/Intro.astro` würde der Block `.intro__stage` durch ein
`<video autoplay muted playsinline>` ersetzt, die Logik drumherum bleibt
unverändert.

Zu bedenken:

- **Ladezeit.** Ein Video von 3 MB braucht auf einer mittelmäßigen
  Mobilverbindung mehrere Sekunden. Genau die Besucher, die am
  Straßenrand stehen, sehen dann zuerst eine schwarze Fläche.
- **Sichtbarer Bruch.** Ein Video hat einen festen Bildausschnitt und
  wird auf einem 390er Display seitlich beschnitten. Die CSS-Variante
  passt sich an, die Fahrzeuge werden auf kleinen Geräten automatisch
  kompakter.
- **Änderungen kosten Geld.** Farbanpassung an das Logo oder eine andere
  Länge heißt beim Video: neu generieren. Bei der jetzigen Lösung ist es
  eine Zahl im Stylesheet.

Empfehlung: die vorhandene Variante erst einmal behalten und im Betrieb
schauen, ob die Besucher sie überhaupt zu Ende sehen. Wenn danach noch
der Wunsch nach einem Video besteht, hier ein einsatzfertiger Prompt für
Veo 3:

> A short cinematic shot at night on a wet asphalt road, seen from a low
> side angle. Two cars approach from opposite sides of the frame,
> headlights flaring across the wet surface, water spraying from the
> tyres. They meet in the centre of the frame and the shot cuts to a
> bright white flash as the impact happens, then to darkness. No people
> visible, no faces, no readable license plates, no text. Moody
> automotive cinematography, golden street lighting against cold blue
> asphalt, shallow depth of field, 35mm lens, slight motion blur.
> Duration 6 seconds, seamless loop, aspect ratio 16:9.

Für die Handy-Variante denselben Prompt mit „aspect ratio 9:16" und
„vertical framing, the two cars meeting in the lower half of the frame".

Wichtig beim Einbau: `poster`-Bild setzen, `preload="metadata"`, und bei
`prefers-reduced-motion` ein Standbild statt des Videos.

## 3D-Modelle

Technisch machbar über `model-viewer` oder Three.js mit einem GLB-Modell.
Praktisch abzuraten:

- Die kleinste sinnvolle Kombination aus Bibliothek und zwei
  Fahrzeugmodellen landet bei 800 KB bis 3 MB.
- Auf älteren Android-Geräten ruckelt die Szene und verbraucht spürbar
  Akku.
- Frei verwendbare Fahrzeugmodelle sind meist ungenau, kostenpflichtige
  Modelle haben oft Lizenzen, die eine Nutzung als Markenauftritt
  ausschließen.

Der optische Gewinn gegenüber der jetzigen Lösung rechtfertigt diesen
Aufwand bei einer Website mit sieben Sektionen nicht.

## Stock-Videos von einem Unfall

Davon rate ich unabhängig von der Technik ab. Echte Crash-Aufnahmen
zeigen fast immer erkennbare Fahrzeuge, teils Personen, und wirken auf
jemanden, der gerade selbst einen Unfall hatte, unangenehm. Dazu kommt
die Lizenzfrage bei kommerzieller Nutzung als Markenauftritt.

## Logo im Opener

Der Opener endet auf dem echten Logo. Die Fahrzeugfarben der Sequenz
sind daran angeglichen: das linke Fahrzeug hell, das rechte im Blau des
Monogramms, der Aufprall in Gold. Splitter und Blitz nehmen denselben
Goldton auf, den auch die Schaltflächen der Seite tragen.

Wird das Logo je ersetzt, genügt ein Lauf von
`node scripts/build-assets.mjs`. Der Opener zieht automatisch nach, weil
er dieselbe Datei `public/logo.png` verwendet wie Header und Footer.
