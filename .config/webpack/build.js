const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.js');

module.exports = merge(base, {
  devtool: false,
  mode: 'production',
  output: {
    path: path.resolve('./dist'),
    filename: 'index.min.js'
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
