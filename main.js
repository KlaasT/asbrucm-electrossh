import { app, BrowserWindow, ipcMain, dialog, Menu, safeStorage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import pty from 'node-pty';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL;
const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

console.log('Starting main.js');

// ── Password encryption helpers ───────────────────────────────────────────────
// Uses Electron's safeStorage (OS keychain: DPAPI on Windows, Keychain on macOS).
// Encrypted values are stored as base64 strings in electron-store.
// Favorites without _passwordEncrypted flag are treated as legacy plaintext
// and will be encrypted automatically on next save.

function encryptPassword(plaintext) {
    if (!plaintext) return '';
    if (!safeStorage.isEncryptionAvailable()) return plaintext;
    return safeStorage.encryptString(plaintext).toString('base64');
}

function decryptPassword(stored) {
    if (!stored) return '';
    if (!safeStorage.isEncryptionAvailable()) return stored;
    try {
        return safeStorage.decryptString(Buffer.from(stored, 'base64'));
    } catch {
        // Value may be legacy plaintext — return as-is rather than locking user out
        return stored;
    }
}

function encryptFavorite(fav) {
    if (!fav.password) return { ...fav, _passwordEncrypted: false };
    return { ...fav, password: encryptPassword(fav.password), _passwordEncrypted: true };
}

function decryptFavorite(fav) {
    if (!fav.password || !fav._passwordEncrypted) {
        const { _passwordEncrypted, ...rest } = fav;
        return rest;
    }
    const { _passwordEncrypted, ...rest } = fav;
    return { ...rest, password: decryptPassword(fav.password) };
}

try {
    const store = new Store();

    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const initializeFavorites = () => {
        let favorites = store.get('favorites', []);
        let modified = false;

        // Ensure every favorite has a unique ID
        favorites = favorites.map(fav => {
            if (!fav.id) {
                modified = true;
                return { ...fav, id: nanoid(5) };
            }
            return fav;
        });
        const ids = favorites.map(fav => fav.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            console.warn('Duplicate IDs found, regenerating...');
            favorites = favorites.map(fav => ({ ...fav, id: nanoid(5) }));
            modified = true;
        }

        // Migrate legacy plaintext passwords to encrypted storage
        favorites = favorites.map(fav => {
            if (fav.password && !fav._passwordEncrypted) {
                modified = true;
                return { ...fav, password: encryptPassword(fav.password), _passwordEncrypted: true };
            }
            return fav;
        });

        if (modified) {
            store.set('favorites', favorites);
        }
    };

    function createWindow() {
        // In dev: __dirname = project root (electron starts with "electron .")
        // preload.mjs is built to dist-electron/ by vite-plugin-electron
        const preloadPath = path.join(__dirname, 'dist-electron', 'preload.mjs');

        const win = new BrowserWindow({
            width: 800,
            height: 600,
            title: store.get('appTitle', packageJson.title || packageJson.name || 'SSH Connection Manager'),
            backgroundColor: '#212529',
            resizable: true,
            webPreferences: {
                preload: preloadPath,
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: false,
            },
            frame: true,
        });

        Menu.setApplicationMenu(null);
        if (isDev) {
            win.loadURL(devUrl).catch(err => console.error('Failed to load dev server:', err));
        } else {
            win.loadFile(path.join(__dirname, 'dist', 'index.html')).catch(err => {
                console.error('Failed to load index.html:', err);
            });
        }
        win.maximize();
        if (isDev) {
            win.webContents.openDevTools();
        }
    }

    const sshConnections = new Map();
    const ptyProcesses = new Map();

    ipcMain.handle('spawn-local-shell', async (event, { tabId, disableEcho }) => {
        try {
            const shellCmd = process.platform === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
            const shellArgs = process.platform === 'win32' ? ['-NoExit'] : [];

            console.log(`Spawning local shell for tab ${tabId} with shell: ${shellCmd}`);

            const ptyProcess = pty.spawn(shellCmd, shellArgs, {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME || process.env.USERPROFILE,
                env: process.env
            });

            ptyProcesses.set(tabId, ptyProcess);

            ptyProcess.on('data', (data) => {
                event.sender.send(`pty-data-${tabId}`, data);
            });

            ptyProcess.on('exit', () => {
                event.sender.send(`pty-close-${tabId}`);
                ptyProcesses.delete(tabId);
            });

            return { success: true };
        } catch (err) {
            console.error(`Failed to spawn shell for tab ${tabId}:`, err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.on('pty-input', (event, { tabId, data }) => {
        const ptyProcess = ptyProcesses.get(tabId);
        if (ptyProcess) {
            ptyProcess.write(data);
        } else {
            console.log('No active PTY process for tab:', tabId);
        }
    });

    ipcMain.on('resize-pty', (event, { tabId, cols, rows }) => {
        const ptyProcess = ptyProcesses.get(tabId);
        if (ptyProcess) {
            ptyProcess.resize(cols, rows);
        }
    });

    ipcMain.on('resize-ssh', (event, { tabId, cols, rows }) => {
        const connection = sshConnections.get(tabId);
        if (connection && connection.shellStream) {
            try {
                connection.shellStream.setWindow(rows, cols);
                console.log(`Resized SSH session for tab ${tabId} to ${cols}x${rows}`);
            } catch (error) {
                console.error(`Failed to resize SSH session: ${error.message}`);
            }
        }
    });

    ipcMain.on('close-tab', (event, tabId) => {
        event.sender.send('close-tab', tabId);
    });

    ipcMain.on('update-tab-display-name', (event, data) => {
        event.sender.send('update-tab-display-name', data);
    });

    ipcMain.on('kill-pty', (event, tabId) => {
        const ptyProcess = ptyProcesses.get(tabId);
        if (ptyProcess) {
            ptyProcess.kill();
            ptyProcesses.delete(tabId);
        }
    });

    ipcMain.handle('connect-ssh', async (event, { tabId, options }) => {
        const ssh = new NodeSSH();
        const { host, username, keyPath, password, port = 22, cols = 80, rows = 24 } = options;

        try {
            const sshOptions = { host, username, port };
            if (keyPath) sshOptions.privateKey = fs.readFileSync(keyPath, 'utf8');
            else if (password) sshOptions.password = password;

            await ssh.connect(sshOptions);
            const shellStream = await ssh.requestShell({ term: 'xterm-256color', cols, rows });

            sshConnections.set(tabId, { ssh, shellStream });

            shellStream.on('data', (data) => {
                event.sender.send(`ssh-data-${tabId}`, data.toString());
            });
            shellStream.on('close', () => {
                event.sender.send(`ssh-close-${tabId}`);
                ssh.dispose();
                sshConnections.delete(tabId);
            });

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    ipcMain.on('ssh-input', (event, { tabId, data }) => {
        const connection = sshConnections.get(tabId);
        if (connection && connection.shellStream) {
            connection.shellStream.write(data);
        } else {
            console.log(`No active SSH session for tab: ${tabId}`);
        }
    });

    ipcMain.on('disconnect-ssh', (event, tabId) => {
        const connection = sshConnections.get(tabId);
        if (connection) {
            connection.ssh.dispose();
            sshConnections.delete(tabId);
        }
    });

    ipcMain.handle('select-ssh-key', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'SSH Keys', extensions: ['pem', ''] }],
        });
        return !result.canceled && result.filePaths.length > 0 ? result.filePaths[0] : null;
    });

    ipcMain.handle('get-settings', () => ({
        useSshKey: store.get('useSshKey', false),
        sshKeyPath: store.get('sshKeyPath', ''),
    }));

    ipcMain.on('save-settings', (event, settings) => {
        store.set('useSshKey', settings.useSshKey);
        store.set('sshKeyPath', settings.sshKeyPath);
    });

    ipcMain.handle('get-favorites', () => {
        return store.get('favorites', []).map(decryptFavorite);
    });

    ipcMain.on('save-favorites', (event, favorites) => {
        store.set('favorites', favorites.map(encryptFavorite));
        event.sender.send('favorites-updated');
    });

    ipcMain.handle('get-app-title', () => {
        return packageJson.title || packageJson.name || 'SSH Connection Manager';
    });

    app.whenReady().then(() => {
        initializeFavorites();
        createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
} catch (error) {
    console.error('Failed to initialize electron app:', error);
    app.quit();
}
