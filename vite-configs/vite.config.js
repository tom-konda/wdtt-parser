import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString())
const bannerText = `
/**
 * WDTT parser ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default defineConfig({
  esbuild: {
    banner: bannerText.trim(),
  },
  build: {
    outDir: '../../../lib',
    lib: {
      entry: './wdtt-parser.ts',
      formats: ['es'],
    },
    minify: false,
  }
})