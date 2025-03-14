import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';

export default defineConfig({
    plugins: [
        vue(),
        electron({
            entry: 'main.js', // Main process entry
            vite: {
                build: {
                    // Ensure main.js is output separately for Electron, not bundled with renderer
                    outDir: 'dist-electron',
                    rollupOptions: {
                        external: ['electron', 'path', 'fs', 'child_process', 'os', 'node-ssh', 'node-pty'], // Externalize Node.js modules
                    },
                },
            },
        }),
    ],
    server: {
        port: 5173,
    },
    build: {
        outDir: 'dist', // Renderer output
        assetsDir: 'assets',
    },
});