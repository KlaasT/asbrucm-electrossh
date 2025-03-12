const { NodeSSH } = require('node-ssh');
const fs = require('fs');

async function connectSSH(terminal, options) {
    const { term, state } = terminal;
    const ssh = new NodeSSH();
    const { host, username, keyPath, password, port = 22 } = options;

    state.sshHost = host;
    state.sshUsername = username;
    state.port = port;

    term.write(`Connecting to ${username}@${host}...\r\n`);

    try {
        const sshOptions = { host, username, port };
        if (keyPath) sshOptions.privateKey = fs.readFileSync(keyPath, 'utf8');
        else if (password) sshOptions.password = password;

        await ssh.connect(sshOptions);
        state.shellStream = await ssh.requestShell();
        term.write('Connected!\r\n');
        term.reset();
        state.shellStream.on('data', data => term.write(data.toString()));
        state.shellStream.on('close', () => {
            term.write('\r\nConnection closed.\r\n$ ');
            ssh.dispose();
            state.shellStream = null;
            state.inputMode = 'command';
        });
    } catch (err) {
        term.write(`Connection failed: ${err.message}\r\n`);
        if (!password && !keyPath) {
            term.write(`Password for ${username}@${host}: `);
            state.inputMode = 'password';
            state.sshAttempts = 0;
            state.promptCallback = pwd => connectSSH(terminal, { ...options, password: pwd });
        } else if (state.sshAttempts < 3) {
            state.sshAttempts++;
            term.write(`Attempt ${state.sshAttempts}/3 failed. Password: `);
            state.inputMode = 'password';
            state.promptCallback = pwd => connectSSH(terminal, { ...options, password: pwd });
        } else {
            term.write('No attempts left.\r\n$ ');
            state.inputMode = 'command';
            state.sshAttempts = 0;
        }
    }
}

module.exports = { connectSSH };