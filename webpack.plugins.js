const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = [new ForkTsCheckerWebpackPlugin(), new webpack.ExternalsPlugin('commonjs', ['electron'])]
