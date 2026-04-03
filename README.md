# ElectroSSH

A tabbed SSH connection manager built with Electron.

# Disclaimer about AI use

This is a project to play for me and I have used AI to generate some of the code and documentation. I have not done a thorough review of the generated code, so there may be security issues, bugs, or other problems. Use at your own risk, and please let me know if you find any issues.

## Background

ElectroSSH is a spiritual successor to [Asbru Connection Manager](https://www.asbru-cm.com/), built by one of its primary maintainers. Asbru-CM is a powerful SSH client, but its Perl/GTK stack makes it difficult to extend and limits it to Linux. ElectroSSH explores what a modern, cross-platform alternative could look like - built on web technologies, running on Windows and Linux.

## Why on Earth Electron?

I'm a web developer, means I can talk to you in Javascript, PHP, HTML and CSS. It all began with a small IRC client for myself and my thoughts where: Can I do more?

## Features
- Tabbed terminal interface with local shell
- SSH connection support (via `node-ssh`)
- Favorites management with groups, optional password/SSH key storage (passwords encrypted via OS keychain)
- Reconnect on connection drop — press any key to reconnect
- Clone Tab via right-click context menu
- Resizable terminal with proper SIGWINCH handling
- Builds as Windows `.exe` and Linux AppImage/deb

## Warning
- **Prototype Quality**: Minimal testing, rough around the edges. Personal use only.
- **Not for critical systems**: Use at your own risk.

## Setup
1. `npm install`
2. `npm run electron:dev` (Electron dev mode with hot reload)
3. `npm run dist` (build `.exe` for Windows)
4. `npm run dist:linux` (build AppImage/deb for Linux)

Or try one of the artifacts in the releases.

## Dependencies
- Electron
- Xterm.js + FitAddon
- Bootstrap 5
- Alpine.js
- node-ssh
- node-pty
- electron-store
- nanoid

Feel free to poke around, but don't rely on this for critical or secure tasks.

## Contribution

If you want to contribute or have wished I am open to PRs and issues. At the moment I am developing this in my free time
and whenever I need an addition. I am open to suggestions and improvements.

## Screenshots

<img src="/screenshots/electrossh1.png" style="width: 550px" />
<img src="/screenshots/electrossh2.png" style="width: 550px" />
<img src="/screenshots/electrossh3.png" style="width: 550px" />

## License

GPL-3.0
