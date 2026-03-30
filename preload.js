import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {

    // ── platform info ────────────────────────────────────────────────────────
    platform: process.platform,

    // ── invoke (returns Promise) ─────────────────────────────────────────────
    spawnLocalShell:  (args)    => ipcRenderer.invoke('spawn-local-shell', args),
    connectSSH:       (args)    => ipcRenderer.invoke('connect-ssh', args),
    getFavorites:     ()        => ipcRenderer.invoke('get-favorites'),
    getSettings:      ()        => ipcRenderer.invoke('get-settings'),
    selectSshKey:     ()        => ipcRenderer.invoke('select-ssh-key'),
    getAppTitle:      ()        => ipcRenderer.invoke('get-app-title'),

    // ── send (fire-and-forget) ────────────────────────────────────────────────
    ptyInput:         (args)    => ipcRenderer.send('pty-input', args),
    resizePty:        (args)    => ipcRenderer.send('resize-pty', args),
    resizeSsh:        (args)    => ipcRenderer.send('resize-ssh', args),
    sshInput:         (args)    => ipcRenderer.send('ssh-input', args),
    closeTab:         (tabId)   => ipcRenderer.send('close-tab', tabId),
    disconnectSsh:    (tabId)   => ipcRenderer.send('disconnect-ssh', tabId),
    saveFavorites:    (favs)    => ipcRenderer.send('save-favorites', favs),
    saveSettings:     (s)       => ipcRenderer.send('save-settings', s),
    updateTabName:    (args)    => ipcRenderer.send('update-tab-display-name', args),
    killPty:          (tabId)   => ipcRenderer.send('kill-pty', tabId),

    // ── static listeners ─────────────────────────────────────────────────────
    onFavoritesUpdated: (cb)         => ipcRenderer.on('favorites-updated',       (_e)          => cb()),
    onCloseTab:         (cb)         => ipcRenderer.on('close-tab',               (_e, tabId)   => cb(tabId)),
    onUpdateTabName:    (cb)         => ipcRenderer.on('update-tab-display-name', (_e, args)    => cb(args)),

    // ── per-tab listeners ─────────────────────────────────────────────────────
    onPtyData:    (tabId, cb) => ipcRenderer.on(`pty-data-${tabId}`,  (_e, data) => cb(data)),
    onPtyClose:   (tabId, cb) => ipcRenderer.on(`pty-close-${tabId}`, ()         => cb()),
    onSshData:    (tabId, cb) => ipcRenderer.on(`ssh-data-${tabId}`,  (_e, data) => cb(data)),
    onSshClose:   (tabId, cb) => ipcRenderer.on(`ssh-close-${tabId}`, ()         => cb()),

    // ── cleanup (call when a tab closes) ─────────────────────────────────────
    removeTabListeners: (tabId) => {
        ipcRenderer.removeAllListeners(`pty-data-${tabId}`);
        ipcRenderer.removeAllListeners(`pty-close-${tabId}`);
        ipcRenderer.removeAllListeners(`ssh-data-${tabId}`);
        ipcRenderer.removeAllListeners(`ssh-close-${tabId}`);
    },
});
