const externalsWin = {
  'active-win-universal': 'commonjs2 active-win-universal',
  'ffi-napi': 'commonjs2 ffi-napi',
  'ref-napi': 'commonjs2 ref-napi',
  iconv: 'commonjs2 iconv'
}

const externalsDarwin = {
  'active-win-universal': 'commonjs2 active-win-universal'
}

const externals = process.platform === 'darwin' ? externalsDarwin : externalsWin

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/electron/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules')
  },
  externals: externals,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  }
}
