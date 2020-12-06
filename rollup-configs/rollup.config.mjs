import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString())
const bannerText = `
/**
 * WDTT parser ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  input: './temp/lib/wdtt-parser.js',
  output: [
    {
      banner: bannerText.trim(),
      file: 'lib/wdtt-parser.js',
      format: 'es'
    },
  ],
  external: ['fs'],
}