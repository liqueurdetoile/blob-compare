const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
  devtool: false,
  mode: 'production',
  output: {
    path: path.resolve('./dist'),
    filename: 'index.min.js',
    library: 'blobCompare'
  },
  plugins: [
    new webpack.IgnorePlugin(/fixtures/),
    new webpack.optimize.ModuleConcatenationPlugin(),
  //  new BundleAnalyzerPlugin()
  ]
});
