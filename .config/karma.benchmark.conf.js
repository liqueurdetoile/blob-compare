// Karma configuration

var webpackConfig = require('./webpack/build.js');

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['benchmark'],
    webpack: webpackConfig,

    // list of files / patterns to load in the browser
    files: [
      'benchmarks/index.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'benchmarks/index.js': ['webpack']
    },

    reporters: ['benchmark'],

    benchmarkReporter: {
      showBrowser: true,
      terminalWidth: 90
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_ERROR,

    autoWatch: false,

    browsers: ['Chrome', 'Firefox', 'Edge'],

    singleRun: true,

    concurrency: 1
  });
};
