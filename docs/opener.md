# Der Opener: was gebaut wurde und welche Alternativen es gibt

Der Wunsch war ein Einstieg mit zwei Fahrzeugen, die einen Unfall
verursachen, und einem Übergang zur Website. Dazu die Frage, ob man das
mit Veo 3 als Video bauen sollte, 3D-Modelle besorgen oder Stockmaterial
verwenden.

## Was jetzt drin ist

Eine in SVG und CSS gebaute Sequenz, rund 4,5 Sekunden lang.

Auf die Reihenfolge am Ende kommt es an: Die Marke steht auf dunklem
Grund, nicht im Hero. Die Seite kommt erst zum Vorschein, während das
Logo nach oben links unterwegs ist.

| Zeit          | Was passiert                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------- |
| 0,00 – 0,30 s | Die Fahrbahnlinie zieht sich auf                                                                    |
| 0,30 – 1,45 s | Zwei Fahrzeuge beschleunigen aus dem Bild heraus aufeinander zu, Scheinwerferkegel wachsen mit      |
| 1,45 s        | Aufprall. Weißer Blitz, zwei Schockwellen, sechzehn Splitter, beide Fahrzeuge federn zurück         |
| 1,70 s        | Das Logo tritt an die Stelle der Fahrzeuge, weiterhin auf dunklem Grund                             |
| 1,90 s        | Der Schriftzug erscheint darunter                                                                   |
| 2,35 – 3,35 s | Die Marke steht still, eine volle Sekunde                                                           |
| 3,35 – 4,25 s | Das Logo fliegt an seinen Platz im Header. Erst dabei teilt sich die Fläche und gibt die Seite frei |
| 4,25 – 4,53 s | Das Logo liegt still auf seiner Endposition, dann verschwindet das Overlay                          |

Eigenschaften:

- Wenige Kilobyte. Ein vergleichbares Video liegt bei 2 bis 8 MB.
- Der Flug am Ende ist gemessen, nicht fest verdrahtet: Das Script
  ermittelt zur Laufzeit, wo das Header-Logo sitzt, und schiebt das
  Bildzeichen genau dorthin. Passt damit auf jeder Bildschirmbreite.
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
`<video autoplay muted playsinline>` ersetzt. Marke, Logo-Flug und
Übergang bleiben unverändert, das Video ersetzt nur den Crash davor.

Zu bedenken:

- **Ladezeit.** Ein Video von 3 MB braucht auf einer mittelmäßigen
  Mobilverbindung mehrere Sekunden. Genau die Besucher, die am
  Straßenrand stehen, sehen dann zuerst eine schwarze Fläche.
- **Fester Bildausschnitt.** Ein Video wird auf einem 390er Display
  seitlich beschnitten. Die CSS-Variante passt sich an, die Fahrzeuge
  werden auf kleinen Geräten automatisch kompakter.
- **Änderungen kosten Geld.** Andere Länge oder Farbanpassung heißt beim
  Video: neu generieren. Bei der jetzigen Lösung ist es eine Zahl im
  Stylesheet.

### Wie ein Veo-3-Prompt aufgebaut sein muss

Nach der offiziellen Anleitung von Google gliedert sich ein Prompt in
**Subject, Action, Style, Camera positioning, Composition, Focus und
Lens, Ambiance** sowie einen eigenen Block für **Audio** (Dialog,
Geräusche, Raumklang). Dazu ein **Negative Prompt** für alles, was nicht
im Bild sein darf.

Drei Punkte, an denen die meisten Prompts scheitern:

1. **Nicht „cinematic" schreiben.** Das Wort erzeugt einen beliebigen
   Effektlook. Stattdessen die Technik benennen: 35mm Filmkorn, flache
   Schärfentiefe, anamorphotischer Lichtreflex, Gegenlicht.
2. **Bewegung in Zeitmarken angeben.** Veo behandelt den Prompt wie eine
   Physiksimulation, nicht wie ein Bild. Was wann passiert, gehört
   ausgeschrieben.
3. **Audio getrennt beschreiben.** Veo erzeugt Ton mit. Ohne Angabe
   erfindet das Modell Musik oder Sprache. Auf der Website läuft das
   Video ohnehin stumm, trotzdem gehört es in den Prompt, sonst
   verschiebt der Ton die Bildkomposition.

Technische Grenzen: **4, 6 oder 8 Sekunden**, wobei 1080p und 4K die
vollen 8 Sekunden brauchen. Seitenverhältnis **16:9 oder 9:16**.

### Prompt Querformat, 8 Sekunden, 1080p

```
Subject and action: Two cars on a wet two-lane road at night, approaching each other from opposite edges of the frame at speed, headlights cutting through fine drizzle, spray lifting from the tyres.

Timing: 0:00-0:01 empty wet asphalt, amber street lamp reflections stretched across the tarmac, nothing moving. 0:01-0:04 both cars enter, one from the left, one from the right, accelerating toward the centre. 0:04 they meet and a single hard white flash blows out the frame for three frames. 0:04-0:06 the flash decays, glass fragments drift outward through the air catching warm golden light. 0:06-0:08 everything settles into deep blue-black, one faint golden glow left in the centre of an otherwise empty frame.

Style: gritty automotive reportage, 35mm film grain, high contrast, deep blue-black shadow rendition, no stylised colour effects.

Camera positioning: locked-off static camera at bumper height, no movement until the impact, then one abrupt two-frame shake and back to static.

Composition: wide shot, both vehicles in full side profile, horizon on the middle third, the centre of the frame kept clear.

Focus and lens: 35mm lens, shallow depth of field, wet asphalt sharp in the foreground, background dissolving into bokeh, subtle anamorphic flare on the headlights.

Ambiance: night, drizzle, cold blue-grey asphalt against warm golden highlights from headlights and street lamps, deep navy overall grade, the final second almost black.

Audio: tyre hiss on wet tarmac rising in pitch, two engines building underneath, one sharp metallic impact at 0:04 followed by falling glass, then near silence with faint rain. No music. No dialogue. No voice-over.

Negative prompt: people, faces, pedestrians, drivers visible in cars, readable license plates, text, logos, watermarks, on-screen graphics, subtitles, gore, blood, fire, explosion, smoke plume, slow-motion ramping, camera zoom, camera push-in, dirty lens, vignette.

Duration 8 seconds. Aspect ratio 16:9. Resolution 1080p.
```

### Prompt Hochformat fürs Handy, 8 Sekunden, 1080p

Gleiche Szene, anderer Ausschnitt. Bei 9:16 muss der Aufprall nach unten
wandern, sonst liegt er hinter dem Logo.

```
Subject and action: Two cars on a wet two-lane road at night, approaching each other from opposite edges of the frame at speed, headlights cutting through fine drizzle, spray lifting from the tyres.

Timing: 0:00-0:01 empty wet asphalt in the lower half of the frame, amber street lamp reflections, nothing moving. 0:01-0:04 both cars enter from left and right and accelerate toward each other. 0:04 they meet in the lower third and a single hard white flash blows out the frame for three frames. 0:04-0:06 the flash decays, glass fragments drift outward catching warm golden light. 0:06-0:08 everything settles into deep blue-black, one faint golden glow left low in the frame.

Style: gritty automotive reportage, 35mm film grain, high contrast, deep blue-black shadow rendition, no stylised colour effects.

Camera positioning: locked-off static camera at bumper height, vertical framing, the upper half of the frame kept dark and empty, no camera movement until the impact, then one abrupt two-frame shake.

Composition: vertical shot, both vehicles in side profile meeting in the lower third, upper half free of detail.

Focus and lens: 40mm lens, shallow depth of field, wet asphalt sharp in the foreground, background dissolving into bokeh, subtle anamorphic flare on the headlights.

Ambiance: night, drizzle, cold blue-grey asphalt against warm golden highlights, deep navy overall grade, the final second almost black.

Audio: tyre hiss on wet tarmac rising in pitch, two engines building underneath, one sharp metallic impact at 0:04 followed by falling glass, then near silence with faint rain. No music. No dialogue. No voice-over.

Negative prompt: people, faces, pedestrians, drivers visible in cars, readable license plates, text, logos, watermarks, on-screen graphics, subtitles, gore, blood, fire, explosion, smoke plume, slow-motion ramping, camera zoom, camera push-in, dirty lens, vignette.

Duration 8 seconds. Aspect ratio 9:16. Resolution 1080p.
```

### Worauf beim Ergebnis zu achten ist

- **Das letzte Bild muss fast schwarz sein.** Nur dann lässt sich das
  Logo sauber darüber einblenden. Ist es zu hell, den Clip am Ende um
  eine halbe Sekunde kürzen.
- **Keine Personen, keine lesbaren Kennzeichen.** Veo hält sich nicht
  immer an den Negative Prompt, also jeden Durchlauf einmal ansehen.
- **Mehrere Durchläufe rechnen.** Realistisch sind fünf bis zehn
  Versuche, bis Anfahrt, Aufprall und Ausklang zusammenpassen.

### Einbau

`poster`-Bild aus dem ersten Frame setzen, damit sofort etwas steht.
Dazu `preload="metadata"`, `muted`, `playsinline` und `autoplay`. Bei
`prefers-reduced-motion` ein Standbild statt des Videos. Die Länge im
Script (`LAND_AT`) muss auf das Ende des Clips gesetzt werden, damit
das Logo im richtigen Moment losfliegt.

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
