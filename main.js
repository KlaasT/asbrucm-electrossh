const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

console.log('Starting main.js');

try {
    const Store = require('electron-store');
    console.log('electron-store loaded:', Store);
    const store = new Store();

    console.log('Creating window');
    function createWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            title: 'SSH Connection Manager',
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
        console.log('Loading index.html');
        win.loadFile('index.html').catch(err => console.error('Failed to load index.html:', err));
        win.maximize();
        //win.webContents.openDevTools();
    }

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

    ipcMain.handle('get-favorites', () => store.get('favorites', []));

    ipcMain.on('save-favorites', (event, favorites) => store.set('favorites', favorites));

    app.whenReady().then(() => {
        console.log('App is ready, creating window');
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