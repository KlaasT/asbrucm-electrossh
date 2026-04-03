# ElectroSSH – Roadmap

Eine Übersicht über mögliche Verbesserungen, geordnet nach Priorität und Aufwand.
Basiert auf dem aktuellen Stand der Codebase (Alpine.js + Bootstrap + Electron).

## Hohe Priorität / Kernfunktionen

### Verbindungsstatus-Anzeige per Tab
**Aktueller Stand:** Kein visuelles Feedback ob ein Tab lokal, verbunden oder getrennt ist.
**Verbesserung:** Farbiger Punkt oder Icon im Tab-Label: grau = lokal, grün = SSH verbunden, rot = Verbindung unterbrochen.

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

### RDP-Unterstützung (externer Client)
**Ansatz:** RDP bleibt ein Zusatzfeature — der Fokus der App liegt auf SSH. Favorites bekommen einen `protocol`-Typ (`ssh` / `rdp`). Bei RDP-Favorites wird der systemseitige RDP-Client als externer Prozess gestartet, kein Einbetten in die App.

**Windows:** `mstsc.exe /v:<host>` — immer verfügbar, kein Setup nötig.
**Linux:** Konfigurierbar in den Settings — Nutzer wählt zwischen `xfreerdp`, `rdesktop` oder einem eigenen Befehl. Default: `xfreerdp`.

**Umsetzung:**
- Favorites-Formular: `protocol`-Feld hinzufügen (`ssh` als Default)
- Settings: RDP-Client-Auswahl für Linux (`xfreerdp` / `rdesktop` / Custom Command)
- `main.js`: neuer IPC-Handler `launch-rdp` der je nach OS den richtigen Client startet
- Tab-Verhalten: RDP-Tabs zeigen einen Hinweis ("RDP session launched externally") statt einem Terminal

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

