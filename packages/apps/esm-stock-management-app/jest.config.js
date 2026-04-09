const path = require('path');
const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@tools$': path.resolve(__dirname, 'tools'),
    '^@tools/(.*)$': path.resolve(__dirname, 'tools', '$1'),
    '^@mocks$': path.resolve(__dirname, '__mocks__'),
    '^@mocks/(.*)$': path.resolve(__dirname, '__mocks__', '$1'),
  },
};
