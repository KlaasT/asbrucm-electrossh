import Alpine from 'alpinejs';
import { createTerminal, resizeTerminal, connectSSH } from './terminal.js';
import { nanoid } from 'nanoid';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'xterm/css/xterm.css';
import '../styles/app.css';

const api = window.electronAPI;

document.addEventListener('alpine:init', () => {
    Alpine.data('appState', () => ({
        terminals: [],
        activeTabId: null,
        contextMenu: { visible: false, x: 0, y: 0, tabId: null },

        showSettingsModal: false,
        showFavoriteModal: false,
        editingFavorite: null,

        favorites: [],
        expandedGroups: {},

        useSshKey: false,
        sshKeyPath: '',

        favoriteForm: {
            id: '',
            displayName: '',
            hostname: '',
            username: '',
            password: '',
            port: 22,
            keyPath: '',
            group: '',
        },

        init() {
            this.addTab();
            this.loadFavorites();
            this.loadSettings();

            let resizeTimer = null;
            const resizeObserver = new ResizeObserver(() => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const t = this.terminals.find(t => t.id === this.activeTabId);
                    if (!t) return;
                    resizeTerminal(t.term, t.fitAddon);
                    if (t.state.shellStream && t.state.shellType === 'ssh') {
                        api.resizeSsh({ tabId: t.id, cols: t.term.cols, rows: t.term.rows });
                    }
                }, 100);
            });
            resizeObserver.observe(document.getElementById('terminal-container'));

            api.onFavoritesUpdated(() => this.loadFavorites());
            api.onCloseTab((tabId) => this.closeTab(tabId));
            api.onUpdateTabName(({ tabId, newName }) => {
                const t = this.terminals.find(t => t.id === tabId);
                if (t) t.displayName = newName;
            });
        },

        // ── Terminal management ──────────────────────────────────────────────

        addTab() {
            const tabId = `Tab-${nanoid(5)}`;
            const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
            terminal.displayName = tabId;
            this.terminals.push(terminal);
            this.switchTab(tabId);
        },

        switchTab(tabId) {
            this.activeTabId = tabId;
            this.terminals.forEach(t => {
                const div = document.getElementById(`terminal-${t.id}`);
                if (div) div.classList.toggle('d-none', t.id !== tabId);
            });
            setTimeout(() => {
                const t = this.terminals.find(t => t.id === tabId);
                if (t) {
                    resizeTerminal(t.term, t.fitAddon);
                    t.term.focus();
                }
            }, 100);
        },

        closeTab(tabId) {
            const index = this.terminals.findIndex(t => t.id === tabId);
            if (index === -1) return;

            const terminal = this.terminals[index];
            if (terminal.state.shellType === 'ssh' && terminal.state.shellStream) {
                api.disconnectSsh(tabId);
            }
            api.removeTabListeners(tabId);
            terminal.term.dispose();
            const div = document.getElementById(`terminal-${tabId}`);
            if (div) div.remove();
            this.terminals.splice(index, 1);

            if (this.activeTabId === tabId) {
                const next = this.terminals[Math.max(0, index - 1)];
                if (next) this.switchTab(next.id);
                else this.addTab();
            }
        },

        // ── Favorites ────────────────────────────────────────────────────────

        async loadFavorites() {
            const favs = await api.getFavorites().catch(err => {
                console.error('Failed to load favorites:', err);
                return [];
            });
            this.favorites = JSON.parse(JSON.stringify(favs));
            this.favorites.forEach(fav => {
                const group = fav.group || 'Ungrouped';
                if (!(group in this.expandedGroups)) {
                    this.expandedGroups[group] = true;
                }
            });
        },

        get groupedFavorites() {
            return this.favorites.reduce((acc, fav) => {
                const group = fav.group || 'Ungrouped';
                if (!acc[group]) acc[group] = [];
                acc[group].push(fav);
                return acc;
            }, {});
        },

        toggleGroup(groupName) {
            this.expandedGroups[groupName] = !this.expandedGroups[groupName];
        },

        removeFavorite(id) {
            const updated = this.favorites.filter(f => f.id !== id);
            api.saveFavorites(JSON.parse(JSON.stringify(updated)));
            this.favorites = updated;
        },

        showContextMenu(event, tabId) {
            this.contextMenu = { visible: true, x: event.clientX, y: event.clientY, tabId };
        },

        async cloneTab(tabId) {
            const source = this.terminals.find(t => t.id === tabId);
            if (!source) return;

            if (source.state.sshOptions) {
                const newTabId = `Tab-${nanoid(5)}`;
                const terminal = createTerminal(newTabId, document.getElementById('terminal-container'), { skipLocalShell: true });
                terminal.displayName = source.displayName;
                this.terminals.push(terminal);
                this.switchTab(newTabId);
                setTimeout(async () => {
                    resizeTerminal(terminal.term, terminal.fitAddon);
                    await connectSSH(newTabId, terminal.term, terminal.state, source.state.sshOptions);
                }, 100);
            } else {
                this.addTab();
            }
        },

        async connectToFavorite(favorite) {
            const tabId = `Tab-${nanoid(5)}`;
            const terminal = createTerminal(tabId, document.getElementById('terminal-container'), { skipLocalShell: true });
            terminal.displayName = favorite.displayName;
            this.terminals.push(terminal);
            this.switchTab(tabId);

            setTimeout(async () => {
                resizeTerminal(terminal.term, terminal.fitAddon);
                terminal.term.focus();
                const options = {
                    host: favorite.hostname,
                    username: favorite.username || '',
                    port: favorite.port || 22,
                    password: favorite.password || '',
                    keyPath: favorite.keyPath || '',
                };
                await connectSSH(tabId, terminal.term, terminal.state, options);
            }, 100);
        },

        // ── Favorite modal ───────────────────────────────────────────────────

        openAddFavorite() {
            this.editingFavorite = null;
            this.favoriteForm = {
                id: nanoid(5),
                displayName: '',
                hostname: '',
                username: '',
                password: '',
                port: 22,
                keyPath: '',
                group: '',
            };
            this.showFavoriteModal = true;
        },

        openEditFavorite(favorite) {
            this.editingFavorite = favorite;
            this.favoriteForm = {
                ...favorite,
                id: favorite.id || nanoid(5),
                hostname: favorite.hostname || favorite.host || '',
                password: favorite.password || '',
                keyPath: favorite.keyPath || '',
                group: favorite.group || '',
            };
            this.showFavoriteModal = true;
        },

        async saveFavorite() {
            if (!this.favoriteForm.hostname) return;
            const favs = await api.getFavorites();
            const entry = { ...this.favoriteForm, port: parseInt(this.favoriteForm.port) || 22 };
            delete entry.host;

            if (this.editingFavorite) {
                const index = favs.findIndex(f => f.id === entry.id);
                if (index !== -1) favs[index] = entry;
                else favs.push(entry);
            } else {
                favs.push(entry);
            }

            api.saveFavorites(JSON.parse(JSON.stringify(favs)));
            this.showFavoriteModal = false;
        },

        async selectSshKeyForFavorite() {
            const keyPath = await api.selectSshKey();
            if (keyPath) this.favoriteForm.keyPath = keyPath;
        },

        // ── Settings modal ───────────────────────────────────────────────────

        async loadSettings() {
            const settings = await api.getSettings().catch(err => {
                console.error('Failed to load settings:', err);
                return { useSshKey: false, sshKeyPath: '' };
            });
            this.useSshKey = settings.useSshKey;
            this.sshKeyPath = settings.sshKeyPath;
        },

        async selectSshKeyForSettings() {
            const keyPath = await api.selectSshKey();
            if (keyPath) this.sshKeyPath = keyPath;
        },

        saveSettings() {
            api.saveSettings({ useSshKey: this.useSshKey, sshKeyPath: this.sshKeyPath });
            this.showSettingsModal = false;
        },
    }));
});

Alpine.start();
