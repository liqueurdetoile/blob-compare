const webpackConfig = require('./.config/webpack/tests.js');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },

  globals: {
    document: false,
    escape: false,
    navigator: false,
    unescape: false,
    window: false,
    describe: true,
    before: true,
    after: true,
    beforeEach: true,
    afterEach: true,
    it: true,
    expect: true,
    sinon: true,
  },

  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    "ecmaVersion": 2018,
  },

  extends: [
    'eslint:recommended',
  ],

  rules: {
    indent: ["error", 2, { "SwitchCase": 1 }],
    'keyword-spacing': [2, { "before": true, "after": true }],
  },

  settings: {
    'import/resolver': {
      webpack: {
        config: webpackConfig
      }
    }
  }
}