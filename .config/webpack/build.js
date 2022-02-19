const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const base = require('./base.js');

module.exports = merge(base, {
  entry: './src/index.js',
  devtool: false,
  mode: 'production',
  output: {
    path: path.resolve('./dist'),
    filename: 'index.min.js',
    clean: true,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
});