const fs = require('fs')
const path = require('path')

const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

const aliases = fs
  .readdirSync('src', { withFileTypes: true })
  .filter((i) => i.isDirectory())
  .reduce((p, c) => {
    return { ...p, [`@${c.name}`]: path.resolve(__dirname, 'src', c.name) }
  }, {})

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
})

module.exports = {
  module: {
    rules
  },
  plugins: plugins,
  resolve: {
    alias: aliases,
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    fallback: { url: false }
  }
}
