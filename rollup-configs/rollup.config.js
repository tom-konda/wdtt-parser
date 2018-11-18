import * as fs from 'fs';

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString())
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