// requires all tests in `project/tests/**/*.spec.js`
const tests = require.context('./', true, /\.spec\.js$/);

tests.keys().forEach(tests);
