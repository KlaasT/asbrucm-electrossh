import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const api = window.electronAPI;

function createTerminal(tabId, container) {
    const term = new Terminal({
        cursorBlink: true,
        allowTransparency: true,
        scrollback: 1000,
        theme: { background: '#1a1a1a' },
        disableStdin: false,
        convertEol: true,
        windowsMode: api.platform === 'win32',
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
    api.spawnLocalShell({ tabId, disableEcho: false }).then((result) => {
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
    api.onPtyData(tabId, (data) => {
        term.write(data);
    });

    api.onPtyClose(tabId, () => {
        term.write('\r\nLocal shell closed.\r\n');
        state.shellStream = false;
        state.shellType = 'local';
        term.write('$ ');
    });

    // Handle SSH data
    api.onSshData(tabId, (data) => {
        term.write(data);

        if (!state.currentCommand.length) {
            state.promptLength = term.buffer.active.cursorX;
        }

        if (data.includes('\x1b[?1049h')) {
            console.log("Full-screen app detected (vim), sending resize event...");
            setTimeout(() => {
                fitAddon.fit();
                api.resizeSsh({ tabId, cols: term.cols, rows: term.rows });
            }, 50);
        }
    });

    api.onSshClose(tabId, () => {
        console.log(`SSH session closed for tab ${tabId}`);
        api.closeTab(tabId);
    });

    // Terminal input handling
    term.onData(data => {
        if (!state.shellStream) return;

        let modifiedData = data;

        const specialKeyMap = {
            '\x1b[5~': '\x1b[5~', // Page Up
            '\x1b[6~': '\x1b[6~', // Page Down
            '\x1b[2~': '\x1b[2~', // Insert
            '\x1b[3~': '\x1b[3~', // Delete
            '\x1b[H': '\x1b[1~',  // Home
            '\x1b[F': '\x1b[4~',  // End
            '\x1b[A': '\x1b[A',   // Up Arrow
            '\x1b[B': '\x1b[B',   // Down Arrow
            '\x1b[C': '\x1b[C',   // Right Arrow
            '\x1b[D': '\x1b[D'    // Left Arrow
        };

        if (specialKeyMap[data]) {
            modifiedData = specialKeyMap[data];
        }

        if (state.shellType === 'ssh') {
            api.sshInput({ tabId, data: modifiedData });
        } else if (state.shellType === 'local') {
            api.ptyInput({ tabId, data: modifiedData });
        }
    });

    term.onResize(({ cols, rows }) => {
        if (state.shellStream) {
            if (cols > 0 && rows > 0) {
                console.log(`Resizing terminal: ${cols}x${rows}`);

                if (state.shellType === 'local') {
                    api.resizePty({ tabId, cols, rows });
                } else if (state.shellType === 'ssh') {
                    api.resizeSsh({ tabId, cols, rows });
                }

                fitAddon.fit();
            } else {
                console.warn(`Ignoring resize event with invalid values: cols=${cols}, rows=${rows}`);
            }
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
    const settings = await api.getSettings().catch(err => {
        console.error('Failed to get settings:', err);
        return { useSshKey: false, sshKeyPath: '' };
    });

    term.write('Connecting...\r\n');

    const finalOptions = {
        ...options,
        keyPath: options.keyPath && options.keyPath.trim() !== ''
            ? options.keyPath
            : (settings.useSshKey && settings.sshKeyPath ? settings.sshKeyPath.trim() : null),
    };

    term.write(`\r\nConnecting to ${options.username || 'unknown'}@${options.host}...\r\n`);
    const result = await api.connectSSH({ tabId, options: { ...finalOptions, cols: term.cols, rows: term.rows } }).catch(err => {
        return { success: false, error: err.message };
    });

    if (result.success) {
        api.sshInput({ tabId, data: 'export TERM=xterm-256color\n' });
        term.write('Connected!\r\n');
        term.reset();
        state.shellType = 'ssh';
        state.shellStream = true;
        api.updateTabName({ tabId, newName: `${options.username || 'user'}@${options.host}` });
        api.resizeSsh({ tabId, cols: term.cols, rows: term.rows });
    } else {
        term.write(`\r\nConnection failed: ${result.error}\r\n`);
        state.shellType = 'local';
    }
}


function resizeTerminal(term, fitAddon) {
    if (fitAddon) fitAddon.fit();
}

export { createTerminal, resizeTerminal, connectSSH };
