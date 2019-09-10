'use strict';

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    'blob-compare': './src/index.js'
  },
  output: {
    jsonpFunction: 'blob-compare',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules|tests|benchmarks/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src')
    ],
    extensions: ['.js'],
    alias: {
      '@': resolve('../src')
    }
  }
};
