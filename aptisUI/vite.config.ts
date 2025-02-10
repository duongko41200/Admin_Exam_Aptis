/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: {
        port: 4000,
    },
    base: './',
    test: {
        globals: true,
        environment: 'jsdom'
    }
});
