const {merge} = require('webpack-merge');
const base = require('./base.js');

module.exports = merge(base, {
  devtool: 'inline-cheap-module-source-map',
  mode: 'development',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  }
});
