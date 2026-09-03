/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: 'src',
  testRegex: '.spec.js$',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

module.exports = config;
