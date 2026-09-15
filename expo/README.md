# ⚡ Zahlenblitz – Expo (iOS + Android)

Plattformübergreifende Version der Kopfrechen-App für die 2. Klasse
(Zahlenraum bis 100, Lehrplan 21). **Eine** Code-Basis für **iOS und Android**,
gebaut mit **Expo / React Native** (TypeScript).

> Die native Kotlin-Android-App liegt weiterhin im Projekt-Wurzelordner als
> Referenz. Diese Expo-Version ist der neue gemeinsame Weg für beide Stores.

## Funktionen (wie die native App)
- 10 Übungstypen (Blitze), Zahlenraum bis 100
- Übungs- und Blitz-Test-Modus (auf Zeit), 3 Schwierigkeitsstufen
- Blitz-Pass mit Fortschritt, Sterne, Abzeichen
- Mehrere Kinder-Profile, **offline** (AsyncStorage)
- Eltern-PIN (SHA-256 via expo-crypto) schützt Löschen & Einstellungen
- Maskottchen Blitzi (SVG), Konfetti, haptisches Feedback

## Lokal starten (Entwicklung)
```bash
cd expo
npm install
npx expo start        # QR-Code mit der Expo-Go-App scannen (iPhone/Android)
```

## Prüfen
```bash
npm run typecheck     # TypeScript ohne Fehler
npx expo export -p android   # JS-Bundle bauen (Metro) – prüft alle Importe
```

## Struktur
```
expo/
├── App.tsx                Navigation (react-navigation)
├── app.json              Expo-Konfiguration (Name, Icons, Bundle-IDs)
├── assets/               Icon, Splash, adaptives Icon
└── src/
    ├── models.ts          ExerciseType, Level, Task
    ├── generators.ts      10 Aufgaben-Generatoren
    ├── storage.ts         Typen + Offline-Speicher (AsyncStorage)
    ├── pin.ts             PIN-Hashing (expo-crypto)
    ├── AppStateContext.tsx  globaler Zustand + Aktionen
    ├── components/        Mascot, HundredField, NumberPad, Confetti, Stars, Dialoge, ui
    └── screens/           Home, Profiles, Pick, Level, Play, Result, Pass, Settings
```

## Veröffentlichen ohne Mac
Siehe [`../STORE_BUILD.md`](../STORE_BUILD.md): iOS **und** Android werden mit
**EAS Build** in der Cloud gebaut – für iOS ist **kein Mac** nötig.
