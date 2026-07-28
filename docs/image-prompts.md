# Bildprompts für Gemini (Imagen)

Fertige Prompts zum Generieren der echten Bilder. Reihenfolge beliebig,
jeder Prompt ist eigenständig.

## Aufbau der Prompts

Die Prompts folgen der aktuell empfohlenen Struktur für Imagen:
**Bildtyp → Motiv → Umgebung → Licht → Stimmung → Kamera und Objektiv →
Stil → Seitenverhältnis**, formuliert als zusammenhängende natürliche
Sprache statt als Stichwortkette. Angaben zu Brennweite und Schärfentiefe
verbessern den fotorealistischen Eindruck spürbar.

## Regeln, die in jedem Prompt stehen

- **Keine Gesichter und keine erkennbaren Personen.** Wenn Hände nötig
  sind, dann angeschnitten.
- **Kein Text, keine Logos, keine Wasserzeichen, keine Nummernschilder
  mit lesbarer Beschriftung.**
- Fotorealistisch, keine Illustration, keine sichtbaren KI-Artefakte.

## Einheitliche Bildsprache

Damit Hero und Kacheln zusammenwirken, gilt für alle Motive dieselbe
Anmutung: kühler, leicht ins Blaue gezogener Asphaltgrund, ein warmer
Goldakzent aus einer Lichtquelle im Bild, gedämpfte Sättigung, kein
greller Kontrast. Der Goldton entspricht der Akzentfarbe der Website
(`#d9a32b`), die aus dem Logo stammt.

---

## 1. Hero, Querformat

**Datei:** `src/assets/hero.jpg` · **Format:** 16:9

> A cinematic wide photograph of a single sedan on a rain-soaked asphalt
> road at night, water spraying from the wheels in a long motion blur.
> Wet reflections of amber street lighting stretch across the tarmac, the
> background falls away into deep unlit darkness. Cold blue-grey asphalt
> against a warm amber glow from the headlights. Shot on a 70mm lens at
> f/2.8 with a slow shutter for horizontal motion blur, shallow depth of
> field, the left third of the frame kept dark and empty for text
> overlay. Moody, restrained, editorial automotive photography, muted
> saturation. No faces, no identifiable people, no text, no logos, no
> readable license plates. Aspect ratio 16:9.

## 2. Hero, Hochformat fürs Handy

**Datei:** `src/assets/hero-portrait.jpg` · **Format:** 9:16

> A cinematic vertical photograph of a car approaching on a rain-soaked
> asphalt road at night, seen slightly from the front, water spray
> catching the light. Amber street lighting reflects in the wet tarmac,
> the upper half of the frame stays dark and empty. Cold blue-grey
> asphalt with a warm amber highlight from the headlights. Shot on a 50mm
> lens at f/2.0, shallow depth of field, subject positioned in the lower
> two thirds. Moody, restrained, editorial automotive photography, muted
> saturation. No faces, no identifiable people, no text, no logos, no
> readable license plates. Aspect ratio 9:16.

Wird dieses Bild geliefert, in `src/components/Hero.astro` importieren
und statt des Zuschnitts aus dem Querformat in die `<source
media="(max-width: 767px)">` einsetzen.

## 3. Karte „Haftpflichtschaden"

**Datei:** `src/assets/leistung-haftpflicht.jpg` · **Format:** 4:3

> A close photograph of a crumpled front wing and cracked headlight
> housing of a dark grey car after a collision, parked on a wet city
> street. Overcast daylight from the side rakes across the deformed metal
> and shows every crease. Cool grey tones with a faint warm reflection in
> the broken lens. Shot on an 85mm lens at f/4, sharp across the damaged
> area, background softly blurred. Documentary, unglamorous, precise.
> No faces, no identifiable people, no text, no logos, no readable
> license plates. Aspect ratio 4:3.

## 4. Karte „Kaskoschaden"

**Datei:** `src/assets/leistung-kasko.jpg` · **Format:** 4:3

> A close photograph of a shattered side window of a car, tempered glass
> broken into thousands of small green-tinged cubes scattered across the
> seat. Diffuse daylight from outside picks out the edges of the glass.
> Cool green-grey tones against the dark interior, one warm amber
> reflection from a distant light. Shot on a 50mm macro lens at f/3.5,
> shallow depth of field. Documentary, quiet, unstaged. No faces, no
> identifiable people, no text, no logos. Aspect ratio 4:3.

## 5. Karte „Kurzgutachten"

**Datei:** `src/assets/leistung-kurzgutachten.jpg` · **Format:** 4:3

> A tight photograph of a shallow dent and paint scuff on the rear door
> of a light coloured car, the kind of small damage left by a parking
> incident. Late afternoon side light grazes the panel so the dent shows
> as a soft distortion in the reflection. Warm neutral tones, gentle
> contrast. Shot on a 100mm lens at f/5.6, the panel filling the frame.
> Documentary, matter of fact. No faces, no identifiable people, no text,
> no logos, no readable license plates. Aspect ratio 4:3.

## 6. Karte „Wertgutachten"

**Datei:** `src/assets/leistung-wertgutachten.jpg` · **Format:** 4:3

> A photograph of a well kept classic saloon car standing in a clean
> private garage, three quarter view from the front. A single warm work
> lamp lights the bonnet and chrome trim, the rest of the garage falls
> into shadow. Deep shadows, warm amber highlights on polished paint.
> Shot on a 35mm lens at f/4, slight wide angle, low camera position.
> Quiet, valuable, collector atmosphere. No faces, no identifiable
> people, no text, no logos, no readable license plates. Aspect ratio 4:3.

## 7. Karte „Beweissicherung"

**Datei:** `src/assets/leistung-beweissicherung.jpg` · **Format:** 4:3

> A close photograph of a paint thickness gauge held against the damaged
> edge of a car door, only a hand and forearm visible at the edge of the
> frame, cropped above the wrist. Cool workshop lighting from above with
> one warm lamp out of frame. Grey metal, matte black tool, a warm
> highlight along the panel edge. Shot on a 60mm macro lens at f/4,
> shallow depth of field on the measuring point. Technical, precise,
> documentary. No faces, no identifiable people, no text, no logos.
> Aspect ratio 4:3.

## 8. Karte „Leasingrückgabe"

**Datei:** `src/assets/leistung-leasing.jpg` · **Format:** 4:3

> A photograph of a printed inspection checklist on a clipboard resting
> on the bonnet of a clean car, a pen lying across it, seen from slightly
> above. Soft overcast daylight, the car paint reflecting a muted sky.
> Neutral greys and paper white with one warm amber reflection in the
> paintwork. Shot on a 45mm lens at f/3.5, shallow depth of field on the
> clipboard. Calm, orderly, documentary. No hands, no faces, no
> identifiable people, no readable text on the form, no logos.
> Aspect ratio 4:3.

## 9. Porträt Kumalic Mersum

**Datei:** `src/assets/portrait.jpg` · **Format:** 4:5

Dieses Bild bitte **nicht generieren**. Ein echtes Foto ist an dieser
Stelle das stärkste Vertrauenssignal der ganzen Seite und ein generiertes
Porträt wäre eine Täuschung.

Anleitung für die Aufnahme mit dem Handy:

- Halbtotale bis Brustbild, Blick in die Kamera, freundlich, nicht steif.
- Hochformat 4:5, damit der Rahmen auf der Seite ohne Beschnitt passt.
- Hintergrund: eigenes Fahrzeug, eine Werkstatt oder eine schlichte Wand.
  Kein aufgeräumtes Wohnzimmer, kein Urlaubsfoto.
- Tageslicht von vorn oder halbseitlich, keine Deckenlampe von oben.
- Arbeitskleidung oder Hemd, so wie er auch beim Termin auftritt.

---

## Einbau nach der Generierung

1. Bilder als JPG in `src/assets/` ablegen, exakt unter den oben
   genannten Dateinamen.
2. `npm run build` ausführen. WebP-Varianten, Zuschnitte und `srcset`
   entstehen automatisch.
3. Nur wenn das Hero-Bild getauscht wurde, zusätzlich
   `node scripts/build-assets.mjs` laufen lassen, damit das
   Vorschaubild für soziale Netzwerke neu erzeugt wird.
4. Alt-Texte in `src/data/site.ts` prüfen und an das neue Motiv anpassen.
