const {merge} = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const base = require('./base.js');

module.exports = merge(base, {
  devtool: false,
  performance: {
    hints: false // Only here to disable large assets message when doing benchmark
  },
  mode: 'production',
  watch: false
});
