import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
    plugins: [
        electron({
            main: {
                entry: 'main.js',
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        rollupOptions: {
                            external: ['electron', 'path', 'fs', 'child_process', 'os', 'node-ssh', 'node-pty'],
                        },
                    },
                },
            },
            preload: {
                input: 'preload.js',
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        rollupOptions: {
                            external: ['electron'],
                            output: {
                                // sandbox:false + contextIsolation:true → preload runs as ESM
                                // (.mjs loaded as ESM, so require() would fail — use import instead)
                                format: 'es',
                            },
                        },
                    },
                },
            },
        }),
        // Electron loads the production build via file:// — crossorigin attributes cause CORS failures
        {
            name: 'remove-crossorigin',
            transformIndexHtml(html) {
                return html.replace(/ crossorigin(?=[\s/>])/g, '');
            },
        },
    ],
    server: {
        port: 5173,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        modulePreload: { polyfill: false },
    },
});
