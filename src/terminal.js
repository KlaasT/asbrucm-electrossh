import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import os from 'os';

const { ipcRenderer } = window.require('electron');

function createTerminal(tabId, container) {
    const term = new Terminal({
        cursorBlink: true,
        allowTransparency: true,
        scrollback: 1000,
        theme: { background: '#1a1a1a' },
        disableStdin: false, // Ensure stdin is enabled
        convertEol: true,    // Convert newlines to CRLF for SSH compatibility
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const state = {
        currentCommand: '',
        inputMode: 'command',
        promptCallback: null,
        sshHost: '',
        sshUsername: '',
        shellStream: false,
        sshAttempts: 0,
        sshProcess: null,
        port: 22,
    };

    const termDiv = document.createElement('div');
    termDiv.id = `terminal-${tabId}`;
    termDiv.className = 'absolute top-0 left-0 w-full h-full hidden';
    container.appendChild(termDiv);

    term.open(termDiv);
    term.write('Simple Terminal - Type commands or "ssh [user@]host"\r\n$ ');
    term.focus();

    term.element.style.userSelect = 'text';
    term.element.style.webkitUserSelect = 'text';
    term.element.style.MozUserSelect = 'text';
    term.element.style.msUserSelect = 'text';

    // Listen for SSH data and close events
    ipcRenderer.on(`ssh-data-${tabId}`, (event, data) => {
        term.write(data);
    });
    ipcRenderer.on(`ssh-close-${tabId}`, () => {
        term.write('\r\nConnection closed.\r\n$ ');
        state.shellStream = false;
        state.inputMode = 'command';
    });

    // Handle terminal input
    term.onData(data => {
        if (data === '\x03') { // Ctrl+C
            if (state.shellStream) {
                ipcRenderer.send('ssh-input', { tabId, data });
            } else if (state.inputMode !== 'command') {
                term.write('\r\nAborted.\r\n$ ');
                state.inputMode = 'command';
                state.currentCommand = '';
                state.sshAttempts = 0;
                if (state.sshProcess) {
                    state.sshProcess.reject(new Error('Login aborted'));
                    state.sshProcess = null;
                }
            }
            return;
        }

        if (state.shellStream) {
            ipcRenderer.send('ssh-input', { tabId, data });
            return;
        }

        if (state.inputMode === 'command') {
            if (data === '\r') {
                term.write('\r\n');
                if (state.currentCommand.startsWith('ssh ')) {
                    const parts = state.currentCommand.split(' ');
                    if (parts.length >= 2) {
                        const arg = parts[1];
                        state.sshUsername = '';
                        if (arg.includes('@')) {
                            const [username, host] = arg.split('@');
                            if (host) {
                                state.sshHost = host;
                                state.sshUsername = username;
                            } else {
                                term.write('Invalid format. Use: ssh [user@]host\r\n$ ');
                                return;
                            }
                        } else {
                            state.sshHost = arg;
                        }
                        if (!state.sshUsername) {
                            term.write(`Username for ${state.sshHost}: `);
                            state.inputMode = 'username';
                            state.promptCallback = (username) => {
                                state.sshUsername = username || os.userInfo().username;
                                connectSSH(tabId, term, state, { host: state.sshHost, username: state.sshUsername, port: state.port });
                            };
                        } else {
                            connectSSH(tabId, term, state, { host: state.sshHost, username: state.sshUsername, port: state.port });
                        }
                    } else {
                        term.write('Invalid format. Use: ssh [user@]host\r\n$ ');
                    }
                } else if (state.currentCommand) {
                    ipcRenderer.invoke('exec-command', { tabId, command: state.currentCommand }).then(result => {
                        if (result.success) {
                            term.write(`${result.output}$ `);
                        } else {
                            term.write(`Error: ${result.output}\r\n$ `);
                        }
                    });
                } else {
                    term.write('$ ');
                }
                state.currentCommand = '';
            } else if (data === '\b' || data.charCodeAt(0) === 127) {
                if (state.currentCommand.length > 0) {
                    state.currentCommand = state.currentCommand.slice(0, -1);
                    term.write('\b \b');
                }
            } else {
                state.currentCommand += data;
                term.write(data);
            }
        } else if (state.inputMode === 'username') {
            if (data === '\r') {
                term.write('\r\n');
                state.promptCallback(state.currentCommand);
                state.currentCommand = '';
            } else if (data === '\b' || data.charCodeAt(0) === 127) {
                if (state.currentCommand.length > 0) {
                    state.currentCommand = state.currentCommand.slice(0, -1);
                    term.write('\b \b');
                }
            } else {
                state.currentCommand += data;
                term.write(data);
            }
        } else if (state.inputMode === 'password') {
            if (data === '\r') {
                term.write('\r\n');
                state.promptCallback(state.currentCommand);
                state.currentCommand = '';
            } else if (data === '\b' || data.charCodeAt(0) === 127) {
                if (state.currentCommand.length > 0) {
                    state.currentCommand = state.currentCommand.slice(0, -1);
                    term.write('\b \b');
                }
            } else {
                state.currentCommand += data;
                term.write('*');
            }
        }
    });

    term.onSelectionChange(() => {
        if (term.hasSelection()) {
            navigator.clipboard.writeText(term.getSelection()).catch(err => console.error('Failed to copy:', err));
        }
    });

    return { id: tabId, term, state, fitAddon };
}

async function connectSSH(tabId, term, state, options) {
    const settings = await ipcRenderer.invoke('get-settings');

    const finalOptions = {
        ...options,
        keyPath: settings.useSshKey ? settings.sshKeyPath : null,
    };

    term.write(`Connecting to ${state.sshUsername}@${state.sshHost}...\r\n`);
    const result = await ipcRenderer.invoke('connect-ssh', { tabId, options: finalOptions });

    if (result.success) {
        term.write('Connected!\r\n');
        term.reset();
        state.shellStream = true;
    } else {
        term.write(`Connection failed: ${result.error}\r\n`);
        if (!options.password) {
            term.write(`Password for ${state.sshUsername}@${state.sshHost}: `);
            state.inputMode = 'password';
            state.sshAttempts = 0;
            state.promptCallback = pwd => connectSSH(tabId, term, state, { ...options, password: pwd });
        } else if (state.sshAttempts < 3) {
            state.sshAttempts++;
            term.write(`Attempt ${state.sshAttempts}/3 failed. Password: `);
            state.inputMode = 'password';
            state.promptCallback = pwd => connectSSH(tabId, term, state, { ...options, password: pwd });
        } else {
            term.write('No attempts left.\r\n$ ');
            state.inputMode = 'command';
            state.sshAttempts = 0;
        }
    }
}

function resizeTerminal(term, fitAddon) {
    if (fitAddon) fitAddon.fit();
}

export { createTerminal, resizeTerminal };