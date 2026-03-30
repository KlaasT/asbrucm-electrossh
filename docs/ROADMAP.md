# ElectroSSH – Roadmap

Eine Übersicht über mögliche Verbesserungen, geordnet nach Priorität und Aufwand.
Basiert auf dem aktuellen Stand der Codebase (Alpine.js + Bootstrap + Electron).

## Hohe Priorität / Kernfunktionen

### Verbindungsstatus-Anzeige per Tab
**Aktueller Stand:** Kein visuelles Feedback ob ein Tab lokal, verbunden oder getrennt ist.
**Verbesserung:** Farbiger Punkt oder Icon im Tab-Label: grau = lokal, grün = SSH verbunden, rot = Verbindung unterbrochen.

### SSH-Reconnect nach Verbindungsabbruch
**Aktueller Stand:** Wenn eine SSH-Session schließt (`ssh-close`-Event), wird der Tab sofort geschlossen (`ipcRenderer.send('close-tab', tabId)`). Der Nutzer verliert den Tab ohne Chance auf Reconnect.
**Verbesserung:** Bei unerwartetem Verbindungsabbruch stattdessen eine Meldung im Terminal anzeigen ("Connection lost. Press R to reconnect.") und den Tab offen lassen.

### Suche / Filter in der Seitenleiste
**Aktueller Stand:** Bei vielen Favorites ist kein Filtern möglich.
**Verbesserung:** Einfaches Suchfeld oben in der Sidebar, das die Favorites live filtert (`x-show` auf Basis eines `searchQuery`-Feldes).

### Import / Export von Favorites
**Aktueller Stand:** Favorites sind nur lokal in `electron-store` gespeichert. Kein Backup, kein Transfer auf andere Maschinen.
**Verbesserung:** Export als JSON-Datei (ohne Passwörter), Import-Dialog der neue Einträge zusammenführt. Zwei neue IPC-Channels: `export-favorites` und `import-favorites`.

---

## Mittlere Priorität / UX

### Tastaturkürzel
**Aktueller Stand:** Alles nur per Maus bedienbar.
**Vorschläge:**
- `Ctrl+T` → Neuer Tab
- `Ctrl+W` → Tab schließen
- `Ctrl+Tab` / `Ctrl+Shift+Tab` → Tab wechseln
- `Ctrl+Shift+F` → Favorite hinzufügen

Umsetzung über `globalShortcut` in `main.js` oder `keydown`-Listener im Renderer.

### Terminal-Einstellungen
**Aktueller Stand:** Schriftgröße und -art sind hardcoded in `terminal.js`.
**Verbesserung:** Im Settings-Modal Optionen hinzufügen: Schriftgröße, Font-Family, Cursor-Stil, Farb-Theme. Werte persistent in `electron-store` speichern und beim Erstellen neuer Terminals anwenden.

### Favorit per Einfachklick verbinden (optional)
**Aktueller Stand:** Verbinden nur per Doppelklick (`@dblclick`).
**Verbesserung:** Optionaler Single-Click-Modus als Setting, oder einen expliziten "Connect"-Button beim Hover anzeigen – besser für Touchpads.

### Tab umbenennen
**Aktueller Stand:** Tab-Name wird automatisch gesetzt (lokal: Tab-ID, SSH: user@host). Kein manuelles Umbenennen möglich.
**Verbesserung:** Doppelklick auf Tab-Label öffnet ein Inline-Input-Feld zum Umbenennen.

---

## Niedrige Priorität / Nice-to-have

### SSH Jump Host / Bastion Support
Verbindungen über einen Zwischenserver routen (`ProxyJump`-Äquivalent). Würde erfordern, die SSH-Verbindungslogik in `main.js` zu erweitern.

### Port-Forwarding
Lokales oder Remote-Port-Forwarding über eine SSH-Session einrichten. UI: Ein "Tunnels"-Bereich pro Verbindung in einem Tab-Kontext-Menü.

### Geteilte Terminal-Panels (Split View)
Zwei Terminals nebeneinander im selben Fenster. Würde eine größere Umstrukturierung des Terminal-Containers erfordern.

### SFTP / Datei-Transfer
Einfacher Datei-Browser per SFTP für eine bestehende SSH-Verbindung. `node-ssh` unterstützt SFTP bereits über `ssh.requestSFTP()`.

### Verbindungslog / Audit-Trail
Protokollierung wann welche Verbindung aufgebaut und getrennt wurde (ohne Befehlsinhalte). Nützlich im professionellen Kontext.

---

## Technische Schulden (intern)

| Problem | Datei | Beschreibung |
|---|---|---|
| `cleanInput`-Funktion ungenutzt | `src/terminal.js:7` | Definiert aber nie aufgerufen – entweder einsetzen oder entfernen |
| Tailwind-Klassen im JS | `src/terminal.js:36` | `termDiv.className = 'absolute top-0 ...'` – Tailwind ist entfernt, die Klassen tun nichts; wird durch CSS in `app.css` nur zufällig gerettet |
| README veraltet | `README.md` | Referenziert noch Tailwind, Vue und `npm run build:css` |
| Kein Error-Handling in `loadFavorites` / `loadSettings` | `src/app.js` | Unbehandelte Promise-Rejections wenn IPC fehlschlägt |
| Kein `preload.js` | `main.js` | Siehe Security-Abschnitt oben |
