import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // View-model types shared with the portal node. Types only — nothing
      // from the server package is ever bundled into the browser.
      '@shared': path.resolve(here, '../shared'),
    },
  },
  server: {
    // The dev server must reach ../shared, which lives outside the app root.
    fs: { allow: [path.resolve(here, '..')] },
    proxy: {
      // In production the portal node serves this bundle from its own origin;
      // in development it runs separately, so proxy /bff to it to keep the
      // browser on one origin and the session cookie working.
      '/bff': {
        target: process.env.WINNET_BFF_ORIGIN || 'http://localhost:8787',
        changeOrigin: false,
      },
    },
  },
});
