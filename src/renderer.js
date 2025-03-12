const { ipcRenderer } = require('electron');
const { nanoid } = require('nanoid');
const { createTerminal, resizeTerminal } = require('./src/terminal');
const { addTab, switchTab, showModal, hideModal, renderFavorites, emitter } = require('./src/ui');
const { connectSSH } = require('./src/ssh');

// Global state
const terminals = { list: [], activeTabId: null };
let editingFavoriteIndex = null;

// Initial setup
async function init() {
    const tabId = `Tab-${nanoid(5)}`;
    const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
    terminals.list.push(terminal);
    addTab(tabId, tabId);
    const favorites = await ipcRenderer.invoke('get-favorites');
    renderFavorites(favorites);
}

// Event handlers
document.getElementById('new-tab-btn').addEventListener('click', () => {
    const tabId = `Tab-${nanoid(5)}`;
    const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
    terminals.list.push(terminal);
    addTab(tabId, tabId); // addTab triggers switchTab, which will resize
});

document.getElementById('settings-btn').addEventListener('click', async () => {
    const settings = await ipcRenderer.invoke('get-settings');
    document.getElementById('useSshKey').checked = settings.useSshKey;
    document.getElementById('sshKeyPath').value = settings.sshKeyPath;
    document.getElementById('sshKeyInput').style.display = settings.useSshKey ? 'block' : 'none';
    showModal('settingsModal');
});

document.getElementById('add-favorite-btn').addEventListener('click', () => {
    editingFavoriteIndex = null;
    document.getElementById('favoriteModalLabel').textContent = 'Add Favorite';
    document.getElementById('favDisplayName').value = '';
    document.getElementById('favHostname').value = '';
    document.getElementById('favUsername').value = '';
    document.getElementById('favPassword').value = '';
    document.getElementById('favKeyPath').value = '';
    document.getElementById('favPort').value = '22';
    document.getElementById('favGroup').value = '';
    showModal('favoriteModal');
});

emitter.on('switchTab', tabId => switchTab(tabId, terminals));
emitter.on('closeTab', tabId => {
    const index = terminals.list.findIndex(t => t.id === tabId);
    if (index === -1) return;
    const terminal = terminals.list[index];
    if (terminal.state.shellStream) terminal.ssh?.dispose();
    terminal.term.dispose();
    document.getElementById(`terminal-${tabId}`).remove();
    document.getElementById(`tab-${tabId}-tab`).parentElement.remove();
    terminals.list.splice(index, 1);
    if (terminals.activeTabId === tabId) {
        terminals.activeTabId = terminals.list.length > 0 ? terminals.list[Math.max(0, index - 1)].id : null;
        if (terminals.activeTabId) switchTab(terminals.activeTabId, terminals);
        else init();
    }
});

window.addEventListener('resize', () => terminals.list.forEach(t => resizeTerminal(t.term, t.fitAddon)));
document.addEventListener('click', e => {
    if (e.target.matches('[data-dismiss="modal"]')) hideModal(e.target.closest('.fixed').id);
});

// API for index.html
window.api = {
    toggleSshKeyInput: () => {
        document.getElementById('sshKeyInput').style.display = document.getElementById('useSshKey').checked ? 'block' : 'none';
    },
    selectSshKey: () => ipcRenderer.invoke('select-ssh-key').then(keyPath => {
        if (keyPath) document.getElementById('sshKeyPath').value = keyPath;
    }),
    saveSettings: () => {
        const settings = {
            useSshKey: document.getElementById('useSshKey').checked,
            sshKeyPath: document.getElementById('sshKeyPath').value,
        };
        ipcRenderer.send('save-settings', settings);
        hideModal('settingsModal');
    },
    toggleGroup: header => {
        const items = header.nextElementSibling;
        items.style.display = items.style.display === 'none' ? 'block' : 'none';
    },
    editFavorite: async index => {
        const favorites = await ipcRenderer.invoke('get-favorites');
        const fav = favorites[index];
        editingFavoriteIndex = index;
        document.getElementById('favoriteModalLabel').textContent = 'Edit Favorite';
        document.getElementById('favDisplayName').value = fav.displayName;
        document.getElementById('favHostname').value = fav.hostname;
        document.getElementById('favUsername').value = fav.username;
        document.getElementById('favPassword').value = fav.password || '';
        document.getElementById('favKeyPath').value = fav.keyPath || '';
        document.getElementById('favPort').value = fav.port || '22';
        document.getElementById('favGroup').value = fav.group || '';
        showModal('favoriteModal');
    },
    selectFavKeyPath: async () => {
        const keyPath = await ipcRenderer.invoke('select-ssh-key');
        if (keyPath) document.getElementById('favKeyPath').value = keyPath;
    },
    saveFavorite: async () => {
        const favorite = {
            displayName: document.getElementById('favDisplayName').value,
            hostname: document.getElementById('favHostname').value,
            username: document.getElementById('favUsername').value,
            password: document.getElementById('favPassword').value || undefined,
            keyPath: document.getElementById('favKeyPath').value || undefined,
            port: parseInt(document.getElementById('favPort').value) || 22,
            group: document.getElementById('favGroup').value || undefined,
        };
        const favorites = await ipcRenderer.invoke('get-favorites');
        if (editingFavoriteIndex !== null) favorites[editingFavoriteIndex] = favorite;
        else favorites.push(favorite);
        ipcRenderer.send('save-favorites', favorites);
        hideModal('favoriteModal');
        renderFavorites(favorites);
    },
    removeFavorite: async index => {
        const favorites = await ipcRenderer.invoke('get-favorites');
        favorites.splice(index, 1);
        ipcRenderer.send('save-favorites', favorites);
        renderFavorites(favorites);
    },
    connectToFavorite: async index => {
        const favorites = await ipcRenderer.invoke('get-favorites');
        const fav = favorites[index];
        const settings = await ipcRenderer.invoke('get-settings');
        const tabId = `Fav-${nanoid(5)}`;
        const terminal = createTerminal(tabId, document.getElementById('terminal-container'));
        terminals.list.push(terminal);
        addTab(tabId, fav.displayName); // addTab triggers switchTab, which will resize
        const options = {
            host: fav.hostname,
            username: fav.username,
            port: fav.port || 22,
            keyPath: fav.keyPath || (settings.useSshKey ? settings.sshKeyPath : null),
            password: fav.password,
        };
        connectSSH(terminal, options);
    },
};

init();