import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    assetsDir: './',
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, './src/'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, './src/components/'),
      },
    ],
  },
});
