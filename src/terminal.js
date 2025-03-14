import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const { ipcRenderer } = window.require('electron');

// Function to filter out ANSI escape sequences and non-printable characters
const cleanInput = (input) => {
    // Remove ANSI escape sequences (e.g., \x1b[O, \x1b[I) and non-printable characters except \r
    return input.replace(/[\x00-\x1F\x7F-\x9F\x1B\[O\x1B\[I]/g, '').trim();
};

function createTerminal(tabId, container) {
    const term = new Terminal({
        cursorBlink: true,
        allowTransparency: true,
        scrollback: 1000,
        theme: { background: '#1a1a1a' },
        disableStdin: false,
        convertEol: true,
        windowsMode: process.platform === 'win32',
        allowProposedApi: true,
        promptLength: 0,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const state = {
        shellType: 'local',
        shellStream: false,
        currentCommand: '',
    };

    const termDiv = document.createElement('div');

    termDiv.id = `terminal-${tabId}`;
    termDiv.className = 'absolute top-0 left-0 w-full h-full hidden';
    container.appendChild(termDiv);

    term.open(termDiv);
    term.write('Simple Terminal - Type "ssh [user@]host" to connect remotely\r\n');
    term.focus();

    term.element.style.userSelect = 'text';
    term.element.style.webkitUserSelect = 'text';
    term.element.style.MozUserSelect = 'text';
    term.element.style.msUserSelect = 'text';

    // Initialize local shell
    ipcRenderer.invoke('spawn-local-shell', { tabId, disableEcho: false }).then((result) => {
        if (result.success) {
            state.shellStream = true;
            fitAddon.fit();
        } else {
            term.write('Failed to spawn local shell.\r\n');
            console.error(`Failed to spawn local shell for tab ${tabId}`);
        }
    }).catch(err => {
        term.write('Error initializing terminal.\r\n');
        console.error(`Error spawning local shell for tab ${tabId}:`, err);
    });

    // Handle local shell data
    ipcRenderer.on(`pty-data-${tabId}`, (event, data) => {
        term.write(data);
    });

    ipcRenderer.on(`pty-close-${tabId}`, () => {
        term.write('\r\nLocal shell closed.\r\n');
        state.shellStream = false;
        state.shellType = 'local';
        term.write('$ ');
    });

    // Handle SSH data
    ipcRenderer.on(`ssh-data-${tabId}`, (event, data) => {
        term.write(data);

        if (!state.currentCommand.length) {
            state.promptLength = term.buffer.active.cursorX;
        }
    });

    ipcRenderer.on(`ssh-close-${tabId}`, () => {
        console.log(`SSH session closed for tab ${tabId}`);

        // Instead of switching back to PowerShell, close the tab
        ipcRenderer.send('close-tab', tabId);
    });

    // Terminal input handling
    term.onData(data => {
        if (!state.shellStream) return;

        if (state.shellType === 'ssh') {
            ipcRenderer.send('ssh-input', { tabId: tabId, data });
        } else if (state.shellType === 'local') {
            ipcRenderer.send('pty-input', { tabId: tabId, data });
        }
    });


    // Resize handling
    term.onResize(({ cols, rows }) => {
        if (state.shellType === 'local' && state.shellStream) {
            ipcRenderer.send('resize-pty', { tabId: tabId, cols: cols, rows: rows });
            fitAddon.fit();
        }
    });

    // Copy selection to clipboard
    term.onSelectionChange(() => {
        if (term.hasSelection()) {
            navigator.clipboard.writeText(term.getSelection()).catch(err => console.error('Failed to copy:', err));
        }
    });

    return { id: tabId, term, state, fitAddon };
}

async function connectSSH(tabId, term, state, options) {
    const settings = await ipcRenderer.invoke('get-settings').catch(err => {
        console.error('Failed to get settings:', err);
        return { useSshKey: false, sshKeyPath: '' };
    });

    const finalOptions = {
        ...options,
        keyPath: settings.useSshKey && settings.sshKeyPath ? settings.sshKeyPath : null,
    };

    term.write(`Connecting to ${options.username || 'unknown'}@${options.host}...\r\n`);
    const result = await ipcRenderer.invoke('connect-ssh', { tabId, options: finalOptions }).catch(err => {
        return { success: false, error: err.message };
    });

    if (result.success) {
        term.write('Connected!\r\n');
        term.reset();
        state.shellType = 'ssh';
        state.shellStream = true;

        // Only rename the display name, NOT the tab ID
        ipcRenderer.send('update-tab-display-name', { tabId, newName: `${options.username || 'user'}@${options.host}` });
    } else {
        term.write(`Connection failed: ${result.error}\r\n`);
        state.shellType = 'local';

        ipcRenderer.invoke('spawn-local-shell', { tabId, disableEcho: true }).then((res) => {
            if (res.success) {
                state.shellStream = true;
                term.write('$ ');
            } else {
                term.write('Failed to restart local shell after SSH failure.\r\n');
            }
        }).catch(err => {
            term.write('Error restarting local shell.\r\n');
            console.error(`Error restarting local shell for tab ${tabId}:`, err);
        });
    }
}


function resizeTerminal(term, fitAddon) {
    if (fitAddon) fitAddon.fit();
}

export { createTerminal, resizeTerminal, connectSSH };