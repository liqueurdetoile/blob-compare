'use strict';

const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  output: {
    library: 'blobCompare',
    libraryTarget: "umd"
  },
  module: {
    rules: [{
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules|tests|benchmarks/
      },
      {
        test: /(worker\.js)$/,
        loader: 'worker-loader',
        options: { inline: isProduction ? "no-fallback" : "fallback" },
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
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true
    }),
  ]
};