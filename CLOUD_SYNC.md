# Cloud-Sync einrichten (Weg 1: Google Play Games)

Mit diesem Weg teilt sich der Fortschritt über mehrere Geräte, die **dasselbe
Google-Konto** verwenden – **ohne eigenen Server**. Google übernimmt Konto und
Speicherung („Gespeicherte Spiele" / Saved Games).

Der Code ist bereits eingebaut. Es fehlt nur noch **deine App-ID** aus der
Play Console. Solange der Platzhalter `0000000000` steht, bleibt der Sync aus
und die App ist normal offline.

## Schritt 1 – Play Games Services anlegen

1. **Play Console** → deine App → linkes Menü **„Wachstum" → „Play Games Services" → „Einrichtung und Verwaltung" → „Konfiguration".**
2. „Ja, meine App verwendet bereits Google-APIs" **oder** neu erstellen wählen.
3. Ein **Google-Cloud-Projekt** verknüpfen (wird angeboten).

## Schritt 2 – Anmeldedaten (OAuth) mit SHA-1

Damit die Anmeldung funktioniert, braucht Google den Fingerabdruck deines
Signatur-Schlüssels:

- **Upload-Schlüssel SHA-1:**
  `1A:85:79:68:41:4D:17:DE:51:A7:30:DA:E2:27:82:FE:9B:87:2C:61`
- Wenn **Play App Signing** aktiv ist (empfohlen): zusätzlich den **App-Signatur-SHA-1**
  eintragen, den die Console unter *Einrichtung → App-Integrität* anzeigt.

In Play Games Services → **Anmeldedaten** → Typ **Android** → Paketname
`ch.blitzrechnen.app` und den/die SHA-1 hinterlegen.

## Schritt 3 – Funktion „Gespeicherte Spiele" aktivieren

Play Games Services → **„Gespeicherte Spiele"** (Saved Games) → **aktivieren**.
(Ohne diese Funktion kann die App keinen Cloud-Speicher anlegen.)

## Schritt 4 – App-ID in den Code eintragen

Die **App-ID** steht in Play Games Services unter **Konfiguration** ganz oben
(eine Zahl, z. B. `123456789012`). Diese Zahl hier eintragen:

`app/src/main/res/values/games_ids.xml`
```xml
<string name="game_services_project_id" translatable="false">123456789012</string>
```

Danach neu bauen:
```bash
./gradlew assembleRelease   # oder bundleRelease für den Store
```

## Schritt 5 – Testkonten freigeben

Vor der Veröffentlichung funktioniert die Anmeldung nur mit **Testkonten**:
Play Games Services → **„Tester"** → deine Google-Adresse(n) hinzufügen.

## So nutzt man es in der App

Einstellungen (hinter der Eltern-PIN) → **„Cloud-Sync"**:
1. **Anmelden** (Play-Games-Dialog).
2. **Jetzt synchronisieren** – lädt den Cloud-Stand, führt ihn mit dem lokalen
   zusammen (es geht nie Fortschritt verloren) und lädt das Ergebnis hoch.

Auf dem zweiten Gerät: gleiches Google-Konto, anmelden, synchronisieren – fertig.

## Datenschutz-Folgen (wichtig!)

Mit Cloud-Sync ändert sich die Datenschutz-Lage:

- Die App hat neu die **Internet-Berechtigung**.
- Es werden Daten an Google übertragen (Spielfortschritt, gekoppelt an das
  Google-Konto). Im **Data-Safety-Formular** des Play Store entsprechend
  angeben („Gespeicherte Spiele / App-Aktivität").
- **Datenschutzerklärung** aktualisieren (Nutzung von Google Play Games).
- **Kinderkonten:** Die Anmeldung macht das **Elternteil**. Bei Kindern unter 13
  (Family Link) kann Play Games eingeschränkt sein – deshalb liegt der Sync
  bewusst im PIN-geschützten Eltern-Bereich.
