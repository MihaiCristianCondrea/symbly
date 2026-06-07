import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/symbly/',
  resolve: {
    alias: {
      '@material/web': resolve(__dirname, 'src/vendor/material-web'),
    },
  },
});
