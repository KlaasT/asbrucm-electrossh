const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { exec } = require('child_process');
const os = require('os');
const { connectSSH } = require('./ssh');

function createTerminal(tabId, container, onData) {
    const term = new Terminal({
        cursorBlink: true,
        allowTransparency: true,
        scrollback: 1000,
        theme: { background: '#1a1a1a' }
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const state = { currentCommand: '', inputMode: 'command', promptCallback: null, sshHost: '', sshUsername: '', shellStream: null, sshAttempts: 0, sshProcess: null, port: 22 };

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

    // Initial fit (optional, we'll rely on later resize)
    // fitAddon.fit();

    term.onData(data => {
        if (data === '\x03') { // Ctrl+C
            if (state.shellStream) state.shellStream.write('\x03');
            else if (state.inputMode !== 'command') {
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
            state.shellStream.write(data);
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
                                term.write(`Connecting to ${state.sshUsername}@${state.sshHost}...\r\n`);
                                connectSSH({ term, state }, { host: state.sshHost, username: state.sshUsername, port: state.port });
                            };
                        } else {
                            term.write(`Connecting to ${state.sshUsername}@${state.sshHost}...\r\n`);
                            connectSSH({ term, state }, { host: state.sshHost, username: state.sshUsername, port: state.port });
                        }
                    } else {
                        term.write('Invalid format. Use: ssh [user@]host\r\n$ ');
                    }
                } else if (state.currentCommand) {
                    exec(state.currentCommand, (error, stdout, stderr) => {
                        if (error) term.write(`Error: ${stderr || error.message}\r\n$ `);
                        else term.write(stdout + '$ ');
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

function resizeTerminal(term, fitAddon) {
    if (fitAddon) {
        fitAddon.fit();
    }
}

module.exports = { createTerminal, resizeTerminal };