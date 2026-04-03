import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const api = window.electronAPI;

function createTerminal(tabId, container, { skipLocalShell = false } = {}) {
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
        sshOptions: null,
    };

    const termDiv = document.createElement('div');
    termDiv.id = `terminal-${tabId}`;
    termDiv.className = 'position-absolute top-0 start-0 w-100 h-100 d-none';
    container.appendChild(termDiv);

    term.open(termDiv);
    term.focus();

    term.element.style.userSelect = 'text';
    term.element.style.webkitUserSelect = 'text';
    term.element.style.MozUserSelect = 'text';
    term.element.style.msUserSelect = 'text';

    if (!skipLocalShell) {
        term.write('Simple Terminal - Type "ssh [user@]host" to connect remotely\r\n');
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
    }

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
        state.shellStream = false;
        state.shellType = 'local';
        if (state.sshOptions) {
            term.write('\r\n\r\nConnection closed. Press any key to reconnect...\r\n');
            const listener = term.onData(() => {
                listener.dispose();
                connectSSH(tabId, term, state, state.sshOptions);
            });
        }
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
        if (state.shellStream && state.shellType === 'local' && cols > 0 && rows > 0) {
            api.resizePty({ tabId, cols, rows });
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

function promptTerminal(term, label, { mask = false } = {}) {
    return new Promise((resolve) => {
        term.write(label);
        let input = '';
        const listener = term.onData((data) => {
            if (data === '\r' || data === '\n') {
                listener.dispose();
                term.write('\r\n');
                resolve(input);
            } else if (data === '\x7f' || data === '\b') {
                if (input.length > 0) {
                    input = input.slice(0, -1);
                    if (!mask) term.write('\b \b');
                }
            } else if (data >= ' ') {
                input += data;
                term.write(mask ? '*' : data);
            }
        });
    });
}

async function connectSSH(tabId, term, state, options) {
    const settings = await api.getSettings().catch(err => {
        console.error('Failed to get settings:', err);
        return { useSshKey: false, sshKeyPath: '' };
    });

    const finalOptions = { ...options };

    finalOptions.keyPath = options.keyPath && options.keyPath.trim() !== ''
        ? options.keyPath
        : (settings.useSshKey && settings.sshKeyPath ? settings.sshKeyPath.trim() : null);

    if (!finalOptions.username || finalOptions.username.trim() === '') {
        finalOptions.username = await promptTerminal(term, `Username for ${options.host}: `);
    }

    if (!finalOptions.keyPath && (!finalOptions.password || finalOptions.password.trim() === '')) {
        finalOptions.password = await promptTerminal(term, `Password for ${finalOptions.username}@${options.host}: `, { mask: true });
    }

    state.sshOptions = { ...finalOptions };

    term.write(`Connecting to ${finalOptions.username}@${options.host}...\r\n`);
    const result = await api.connectSSH({ tabId, options: { ...finalOptions, cols: term.cols, rows: term.rows } }).catch(err => {
        return { success: false, error: err.message };
    });

    if (result.success) {
        api.sshInput({ tabId, data: 'export TERM=xterm-256color\n' });
        term.write('Connected!\r\n');
        term.reset();
        state.shellType = 'ssh';
        state.shellStream = true;
        api.updateTabName({ tabId, newName: `${finalOptions.username}@${options.host}` });
        api.resizeSsh({ tabId, cols: term.cols, rows: term.rows });
    } else {
        term.write(`\r\nConnection failed: ${result.error}\r\n`);
        term.write('Press any key to retry...\r\n');
        state.shellType = 'local';
        const listener = term.onData(() => {
            listener.dispose();
            connectSSH(tabId, term, state, state.sshOptions);
        });
    }
}


function resizeTerminal(term, fitAddon) {
    if (fitAddon) fitAddon.fit();
}

export { createTerminal, resizeTerminal, connectSSH };
