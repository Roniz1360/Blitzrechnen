# Veröffentlichung im Google Play Store

Diese App ist Play-Store-fähig vorbereitet: Release-Signierung, App-Bundle (AAB)
und Sicherheits-Härtung (kein Backup der Kinderdaten) sind eingerichtet.

## 1. Signier-Schlüssel (Keystore)

Der Release-Schlüssel liegt in `blitzrechnen-release.jks` und wird über
`keystore.properties` eingebunden. **Beide Dateien sind bewusst *nicht* im Git**
(siehe `.gitignore`) – ein Signier-Schlüssel ist geheim.

> ⚠️ **Wichtig:** Bewahre die Datei `blitzrechnen-release.jks` und das Passwort
> sicher auf. Ohne sie kannst du **keine Updates** der App mehr veröffentlichen.

`keystore.properties` (Vorlage – trage deine Werte ein):

```properties
storeFile=blitzrechnen-release.jks
storePassword=DEIN_STORE_PASSWORT
keyAlias=blitzrechnen
keyPassword=DEIN_KEY_PASSWORT
```

Einen neuen eigenen Schlüssel erstellst du so:

```bash
keytool -genkeypair -v -keystore blitzrechnen-release.jks \
  -alias blitzrechnen -keyalg RSA -keysize 2048 -validity 10000
```

## 2. Release bauen

```bash
./gradlew bundleRelease     # -> app/build/outputs/bundle/release/app-release.aab  (für Play Store)
./gradlew assembleRelease   # -> app/build/outputs/apk/release/app-release.apk     (zum direkten Teilen)
```

Ist keine `keystore.properties` vorhanden, baut der Release-Typ unsigniert
(z. B. auf einem fremden Rechner) – der Rest des Projekts bleibt baubar.

## 3. Im Play Store hochladen

1. Google-Play-Entwicklerkonto anlegen (einmalig 25 USD).
2. Neue App anlegen → **App-Bundle** `app-release.aab` hochladen.
3. **Play App Signing** aktivieren (empfohlen): Google verwaltet den finalen
   Signier-Schlüssel; deine `.jks` dient dann als *Upload-Schlüssel*.
4. Pflichtangaben ausfüllen: Datenschutzerklärung, Inhaltseinstufung
   (Kinder-App → **Programm «Für Familien geeignet»** beachten), Zielgruppe.
5. Da die App **keine Daten sammelt und keine Berechtigungen** hat, ist der
   Data-Safety-Fragebogen einfach: «Es werden keine Daten erfasst oder geteilt.»

## 4. Sicherheitsübersicht

- Keine Berechtigungen, kein Internet, keine Werbung, kein Tracking.
- `allowBackup=false` + Extraktionsregeln → Kinderdaten werden nicht in
  Cloud-Backups oder Gerät-Transfers kopiert.
- Eltern-PIN (SHA-256-gehasht) schützt Profil-Löschen und Einstellungen.
- Alle Daten liegen ausschliesslich lokal in der App-Sandbox.
