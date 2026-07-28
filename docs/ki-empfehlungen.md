# KI im Sachverständigenbüro: was sich für einen Einzelunternehmer lohnt

Die Frage aus dem Briefing war, ob und wie KI sinnvoll eingesetzt werden
kann. Kurz: ja, aber an anderen Stellen als meist beworben. Der Engpass
eines Einzelkämpfers ist nicht die Gutachtenqualität, sondern die Zeit
zwischen den Terminen. Genau dort setzt die Reihenfolge unten an.

Sortiert nach Nutzen pro investierter Stunde.

---

## 1. Diktat statt Tippen bei der Besichtigung

**Zeitgewinn: hoch. Aufwand: eine Stunde. Kosten: rund 20 Euro im Monat.**

Der Befund wird während der Besichtigung ins Handy gesprochen, statt ihn
abends abzutippen. Whisper-basierte Apps erreichen bei deutschem Diktat
inzwischen eine Genauigkeit, die Nacharbeit auf Korrekturlesen
reduziert. Fachbegriffe wie Wiederbeschaffungswert oder Nutzungsausfall
lassen sich als Vokabular hinterlegen.

Realistisch sind 20 bis 40 Minuten pro Gutachten. Bei zwei Gutachten am
Tag ist das mehr als eine gewonnene Arbeitsstunde.

**Konkret:** eine Diktat-App mit deutschem Modell und lokaler oder
EU-Verarbeitung. Wichtig, weil in der Aufnahme personenbezogene Daten des
Geschädigten stecken.

## 2. Erstantwort auf Anfragen vorbereiten

**Zeitgewinn: mittel bis hoch. Aufwand: zwei Stunden. Kosten: gering.**

Die meisten Erstanfragen laufen auf dieselben fünf Fragen hinaus: Wer
zahlt, wie schnell, wo, was mitbringen, brauche ich einen Anwalt. Ein
Sprachmodell mit den Inhalten dieser Website als Grundlage formuliert
daraus in Sekunden eine passende Antwort, die nur noch geprüft und
abgeschickt wird.

**Wichtig:** nicht automatisch versenden. Der Vorteil gegenüber einem
Großbüro ist die persönliche Antwort. Ein Modell, das ungeprüft schreibt,
verspielt genau diesen Vorteil. Vorschlagen lassen, überfliegen,
anpassen, senden.

## 3. Vorsortierung eingehender Schadenfotos

**Zeitgewinn: mittel. Aufwand: einen Tag. Kosten: gering.**

Wenn per WhatsApp ein Foto kommt, geht es um eine einzige Entscheidung:
Lohnt sich ein volles Gutachten oder reicht ein Kostenvoranschlag? Ein
Bildmodell kann eine Einschätzung liefern, ob der Schaden deutlich über
oder unter der Bagatellgrenze liegt, und welche Bauteile betroffen sind.

**Klare Grenze:** Das ist eine Vorsortierung für den eigenen Kalender,
niemals eine Aussage gegenüber dem Kunden und schon gar keine Zahl im
Gutachten. Ein Sachverständiger haftet für sein Gutachten. Eine von einem
Modell geschätzte Schadenhöhe hat darin nichts verloren.

## 4. Google-Unternehmensprofil pflegen

**Zeitgewinn: gering. Wirkung: hoch. Aufwand: zwei Stunden im Monat.**

Für einen lokalen Dienstleister bringt das Unternehmensprofil bei Google
mehr Anfragen als jede Suchmaschinenoptimierung an der Website. Ein
Sprachmodell hilft bei den Beiträgen, den Antworten auf Bewertungen und
den Fragen und Antworten im Profil.

**Voraussetzung dafür ist eine Geschäftsadresse.** Die fehlt derzeit auch
auf dieser Website. Das ist der wichtigste offene Punkt überhaupt: ohne
Ort keine lokale Sichtbarkeit, weder bei Google noch bei ChatGPT.

## 5. Textbausteine für wiederkehrende Gutachtenteile

**Zeitgewinn: mittel. Aufwand: ein Tag einmalig.**

Formulierungen zu Reparaturweg, Wertminderung oder Restwertermittlung
wiederholen sich. Aus zehn bis fünfzehn eigenen, abgeschlossenen
Gutachten lässt sich eine Bausteinsammlung ableiten, die ein Modell
fallbezogen anpasst.

**Wichtig:** vor der Verarbeitung anonymisieren. Namen, Kennzeichen und
Adressen raus, bevor irgendetwas in ein Modell geht.

---

## Wovon ich abrate

**Vollautomatischer Chatbot auf der Website.**
Wurde im Briefing angeregt, wäre hier aber ein Rückschritt. Der
Verkaufsgrund dieser Seite ist, dass ein Mensch drangeht. Ein Bot, der
Öffnungszeiten aufsagt, schwächt genau das ab. Die häufigen Fragen sind
in der FAQ-Sektion beantwortet, und wer mehr wissen will, ist mit einer
WhatsApp in fünf Sekunden schneller als mit einem Chatfenster.

Falls sich das ändert, weil die Anfragen über den Kopf wachsen: die
Struktur dafür liegt bereit. Eine zweite Pages Function
`functions/api/chat.js` neben dem Kontaktformular, gespeist aus den
Inhalten dieser Seite, mit Übergabe an WhatsApp, sobald es konkret wird.
Erst dann lohnt sich der Aufwand.

**KI-generierte Schadensummen gegenüber Kunden.**
Berufsrechtlich und haftungsrechtlich heikel. Wer eine Zahl nennt, muss
für sie einstehen.

**Automatisch generierte Blogtexte für die Suchmaschine.**
Google bewertet erkennbar unbetreute Massentexte seit einiger Zeit
schlechter. Ein einziger echter Fall aus der eigenen Praxis, anonymisiert
und sauber aufgeschrieben, bringt mehr als zwanzig generische Ratgeber.

---

## Datenschutz, kurz gefasst

Gutachtenunterlagen enthalten besonders sensible Angaben: Unfallhergang,
Fahrzeugdaten, manchmal Gesundheitsdaten. Drei Regeln reichen:

1. **Anonymisieren vor der Verarbeitung.** Namen, Kennzeichen, Adressen
   entfernen, bevor Text oder Bild in ein Modell geht.
2. **Anbieter mit EU-Verarbeitung oder Auftragsverarbeitungsvertrag
   wählen.** Kostenlose Verbraucherzugänge verwenden Eingaben teilweise
   zum Training. Für Mandantendaten ausgeschlossen.
3. **Ergebnisse immer prüfen.** Ein Modell erfindet Details, wenn ihm
   welche fehlen. Im Gutachten ist das ein Haftungsfall.

---

## Empfohlene Reihenfolge

| Wann                | Was                                                    |
| ------------------- | ------------------------------------------------------ |
| Diese Woche         | Adresse klären, dann Google-Unternehmensprofil anlegen |
| Nächste zwei Wochen | Diktat-App einrichten und bei drei Gutachten testen    |
| Danach              | Antwortvorlagen für die fünf Standardfragen aufbauen   |
| Nach drei Monaten   | Fotovorsortierung, wenn das Anfragevolumen es hergibt  |
| Später              | Chatbot, aber nur bei nachweislicher Überlastung       |

Punkt eins kostet nichts und bringt am meisten.
