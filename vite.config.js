import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages serves this repository at /symbly/. Change to '/' when deploying to a custom domain root.
  base: '/symbly/',
  resolve: {
    alias: {
      '@material/web': resolve(__dirname, 'src/vendor/material-web'),
    },
  },
});
