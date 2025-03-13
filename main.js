import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url'; // Import url module to handle ES modules
import Store from 'electron-store';
import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import { exec } from 'child_process';
import { nanoid } from 'nanoid';

// Derive __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

console.log('Starting main.js');

try {
    const store = new Store();

    // Read package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const initializeFavorites = () => {
        let favorites = store.get('favorites', []);
        let modified = false;
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
        if (modified) {
            store.set('favorites', favorites);
        }
    };

    function createWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            title: store.get('appTitle', packageJson.title || packageJson.name || 'SSH Connection Manager'),
            backgroundColor: '#212529',
            resizable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: false,
            },
            frame: true,
        });

        Menu.setApplicationMenu(null);
        if (isDev) {
            win.loadURL('http://localhost:5173').catch(err => console.error('Failed to load dev server:', err));
        } else {
            // Use __dirname to load the built index.html
            win.loadFile(path.join(__dirname, 'dist/index.html')).catch(err => {
                console.error('Failed to load index.html:', err);
            });
        }
        win.maximize();
        //win.webContents.openDevTools();
    }

    const sshConnections = new Map();

    ipcMain.handle('connect-ssh', async (event, { tabId, options }) => {
        const ssh = new NodeSSH();
        const { host, username, keyPath, password, port = 22 } = options;

        try {
            const sshOptions = { host, username, port };
            if (keyPath) sshOptions.privateKey = fs.readFileSync(keyPath, 'utf8');
            else if (password) sshOptions.password = password;

            await ssh.connect(sshOptions);
            const shellStream = await ssh.requestShell();

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
            console.log('No active SSH connection for tab:', tabId);
        }
    });

    ipcMain.on('disconnect-ssh', (event, tabId) => {
        const connection = sshConnections.get(tabId);
        if (connection) {
            connection.ssh.dispose();
            sshConnections.delete(tabId);
        }
    });

    ipcMain.handle('exec-command', async (event, { tabId, command }) => {
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    resolve({ success: false, output: stderr || error.message });
                } else {
                    resolve({ success: true, output: stdout });
                }
            });
        });
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
        const favorites = store.get('favorites', []);
        return favorites;
    });

    ipcMain.on('save-favorites', (event, favorites) => {
        store.set('favorites', favorites);
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
    console.error('Failed to initialize electron-store:', error);
    app.quit();
}