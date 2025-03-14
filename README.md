# asbru-cm ElectroSSH Prototype

This is a quick, hacked-together terminal manager I built because I couldn’t find a simple solution for managing SSH connections in a tabbed interface. It uses Electron, Xterm.js, and Tailwind CSS to provide a basic GUI for SSH sessions with a favorites list.

## Why asbru-cm?

Some of you may recognize the name from the [Asbru Connection Manager](https://www.asbru-cm.com/), an opensource SSH client that I am involved in.
My main issue is that asbru-cm is based on Perl and GTK, which in total creates a complex codebase to maintain and extend.

My second issue is that at my company we are now dedicated to Microsoft Windows, which hinders me working with asbru-cm on a regular basis.

I didn't have the time to contribute that much to the project anymore due to the older codebase and though tried something as a hobby.

So the name is just taken as an inspiration and prototype. I have not decided that this should be a definite successor to the project.

## Why on Earth Electron?

I'm a web developer, means I can talk to you in Javascript, PHP, HTML and CSS. It all began with a small IRC client for myself and my thoughts where: Can I do more?

## Features
- Tabbed terminal interface
- SSH connection support (via `node-ssh`)
- Favorites management with optional password/key storage
- Built as a Windows `.exe`
- Should be buildable as AppImage for Linux

## Warning
- **Not Security-Checked**: Passwords are stored in plaintext via `electron-store`. Use at your own risk, especially on shared machines.
- **Prototype Quality**: Minimal error handling, potential bugs, and no extensive testing.
- **Personal Use**: This was made for my own needs, so it’s rough around the edges.

## Setup
1. `npm install`
2. `npm run build:css` (compiles Tailwind CSS)
3. `npm start` (runs locally)
4. `npm run build` (builds `.exe` for Windows)

Or try one of the artifacts in the releases.

## Dependencies
- Electron
- Xterm.js + FitAddon
- Tailwind CSS
- node-ssh
- electron-store
- nanoid, mitt
- vue
- node-pty

Feel free to poke around, but don’t rely on this for critical or secure tasks.

## Contribution

If you want to contribute or have wished I am open to PRs and issues. At the moment I am developing this in my free time
and whenever I need an addition. I am open to suggestions and improvements.

## Screenshots

<img src="/screenshots/electrossh1.png" style="width: 550px" />
<img src="/screenshots/electrossh2.png" style="width: 550px" />
<img src="/screenshots/electrossh3.png" style="width: 550px" />


## License

GPL-3.0

``` 