export default {
  input: './lib/wdtt-parser.js',
  output: [
    { file: 'lib/wdtt-parser.cjs.js', format: 'cjs'},
  ],
  external: ['fs'],
}