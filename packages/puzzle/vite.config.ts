import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: [
      {
        find: '@data',
        replacement: resolve(__dirname, './data/'),
      },
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
