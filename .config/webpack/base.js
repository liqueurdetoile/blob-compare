'use strict';

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'blobCompare',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules|tests|benchmarks/
      },
      {
        test: /(\.worker.js)$/,
        loader: 'worker-loader',
        options: { inline: true, fallback: false },
        exclude: /node_modules/
      },
      {
        test: /\.(bmp|png|jpe?g|txt)$/i,
        loader: 'arraybuffer-loader',
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
      '@': path.resolve('./src')
    }
  }
};
