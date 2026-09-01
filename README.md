# ⚡ Zahlenblitz

Eine Android-App zum **Kopfrechnen-Training für die 2. Klasse** (Zahlenraum bis 100),
angelehnt an das Blitzrechnen-Konzept aus dem *Schweizer Zahlenbuch* und passend zum
**Lehrplan 21** (Kanton Aargau, Ende Zyklus 1). Gemacht für 7-jährige Kinder: grosse
Knöpfe, kräftige Farben, Maskottchen «Blitzi» und sofortiges Feedback.

> Eigenständige Neuentwicklung – keine Verbindung zum Verlag Klett und Balmer.

## Was die App kann

**10 Übungstypen (Blitze)** für den Zahlenraum bis 100:

| # | Übung | Beispiel | LP21 |
|---|-------|----------|------|
| 1 | Wie viele? (Hunderterfeld) | zähle die Punkte → 64 | MA.1.A.1 |
| 2 | Zahlen finden (Hundertertafel) | zwischen 56 und 58 → 57 | MA.1.A.1.c |
| 3 | Zählen in Schritten | 40, 45, 50, … → 55 | MA.1.A.2.d |
| 4 | Ergänzen zum Zehner | 63 + _ = 70 → 7 | MA.1.A.3.b |
| 5 | Ergänzen bis 100 | 80 + _ = 100 → 20 | MA.1.A.3.b |
| 6 | Verdoppeln & Halbieren | Verdopple 30 → 60 | MA.1.A.3.b |
| 7 | Plusaufgaben | 34 + 25 → 59 | MA.1.A.3.b |
| 8 | Minusaufgaben | 68 − 24 → 44 | MA.1.A.3.b |
| 9 | 100 teilen | 100 = 70 + _ → 30 | MA.1.A.3.b |
| 10 | Malreihen 2·5·10 | 5 · 4 → 20 | MA.1.A.3.c |

**Zwei Modi**
- **Üben** – ohne Zeitdruck, mit Farb-Feedback (grün = richtig), Tipp bei Fehlern und
  bildlicher Stütze (Hunderterfeld).
- **Blitz-Test** – auf Zeit (30/60/90/120 s einstellbar), feste Aufgabenzahl,
  Ergebnis in Prozent. Ab 80 % gilt der Blitz als *bestanden*.

**Weitere Funktionen**
- 3 Schwierigkeitsstufen je Übung (Anfänger · Könner · Profi).
- **Blitz-Pass**: Fortschritt pro Übung (geübt / getestet / bestanden), Bestwerte, Sterne.
- Mehrere **Kinder-Profile** (anonym, ohne Personendaten – DSG-konform).
- **Offline** – alle Daten bleiben auf dem Gerät (DataStore).
- Dezente Gamification: Sterne, Blitz-Abzeichen 🏅, kurze Konfetti-Belohnung.
- Haptisches und akustisches Feedback (abschaltbar).

## Technik

- **Kotlin** + **Jetpack Compose** (Material 3)
- **Navigation Compose**, **DataStore** (Preferences) + kotlinx.serialization
- minSdk 24 · targetSdk/compileSdk 34 · package `ch.blitzrechnen.app`

## Bauen

```bash
# Android SDK-Pfad angeben (Datei local.properties)
echo "sdk.dir=/pfad/zum/Android/Sdk" > local.properties

./gradlew assembleDebug      # baut app/build/outputs/apk/debug/app-debug.apk
```

Oder das Projekt einfach in **Android Studio** öffnen und auf ▶ drücken.

## Projektstruktur

```
app/src/main/java/ch/blitzrechnen/app/
├── model/         Datentypen (ExerciseType, Level, Task)
├── generators/    Aufgaben-Generatoren (10 Blitze)
├── data/          Speicherung (Profile, Fortschritt, offline)
├── viewmodel/     AppViewModel
└── ui/
    ├── theme/       Farben, Typografie (kindgerecht)
    ├── components/   Hunderterfeld, Ziffernblock, Maskottchen, Konfetti
    └── screens/      Home, Übungswahl, Stufenwahl, Spiel, Ergebnis, Pass, Profile, Einstellungen
```
