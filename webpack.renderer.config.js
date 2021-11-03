const path = require('path')
const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const CopyWebpackPlugin = require('copy-webpack-plugin')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
})

module.exports = {
  module: {
    rules
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'assets/'),
          to: path.resolve(__dirname, '.webpack/renderer/mex_window/assets/')
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  }
}
