const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testMatch: [ "**/*.e2e.ts" ],
  testEnvironment: 'node',
  detectOpenHandles: true,
  // From https://github.com/facebook/jest/issues/1456#issuecomment-600811247
  forceExit: true,
};

module.exports = createJestConfig(customJestConfig);
