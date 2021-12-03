module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.dev.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules')
  },
  externals: {
    'active-win-universal': 'commonjs2 active-win-universal',
    'ffi-napi': 'commonjs2 ffi-napi',
    'ref-napi': 'commonjs2 ref-napi',
    iconv: 'commonjs2 iconv'
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  }
}
