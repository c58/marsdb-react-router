'use strict';

module.exports = {
  src: 'lib/**/*',
  dist: 'dist',
  build: 'build',

  browser: {
    bundleName: 'marsdb.react.router.js',
    bundleMinName: 'marsdb.react.router.min.js',
    entry: 'index.js',
    entryTests: 'browser_tests.js',
  }
};
