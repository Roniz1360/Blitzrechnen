# Veröffentlichen: iOS + Android mit Expo (ohne eigenen Mac)

Die App liegt jetzt als **eine gemeinsame Code-Basis** im Ordner [`expo/`](expo/).
Gebaut wird mit **EAS Build** (Expos Cloud-Bau-Dienst) – iOS **und** Android
werden auf Expos Servern kompiliert, **du brauchst keinen Mac**.

## Einmalige Vorbereitung
1. Kostenloses **Expo-Konto** erstellen: https://expo.dev
2. Werkzeuge nutzen (kein Install nötig, via `npx`):
   ```bash
   cd expo
   npm install
   npx eas login          # bei Expo anmelden
   npx eas build:configure
   ```

## Android bauen
```bash
npx eas build --platform android --profile production   # -> .aab für Play Store
npx eas build --platform android --profile preview      # -> .apk zum direkten Testen
```

## iOS bauen (ohne Mac!)
Voraussetzung: **Apple Developer Program** (99 USD/Jahr).
```bash
npx eas build --platform ios --profile production
```
- EAS fragt nach deinem Apple-Login und erstellt die nötigen Zertifikate/Profile
  **automatisch in der Cloud** – kein Mac, kein Xcode.
- Ergebnis ist eine `.ipa`, die EAS direkt hochladen kann:
  ```bash
  npx eas submit --platform ios --latest
  ```

## Beides gleichzeitig
```bash
npx eas build --platform all --profile production
```

## Testen ohne Store
- **Schnell während der Entwicklung:** `npx expo start` → in der App **Expo Go**
  (iPhone/Android) den QR-Code scannen.
- **Echter Build:** iOS über **TestFlight** (Apples Beta-System, läuft über Browser
  + iPhone), Android über den internen Testkanal.

## Bundle-IDs (bereits gesetzt in `expo/app.json`)
- iOS: `ch.blitzrechnen.app`
- Android: `ch.blitzrechnen.app`

## Wichtig für die Kinder-App
- **Apple Kids Category** und **Google „Für Familien"**: keine Werbung, kein
  Tracking – erfüllt die App bereits.
- **Datenschutzerklärung** wird von beiden Stores verlangt.
- Cloud-Sync über iPhone **und** Android später via **Firebase** (Play Games ist
  Android-only) – bewusst noch nicht eingebaut.
