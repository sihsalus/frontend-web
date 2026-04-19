const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@mocks/(.*)$': '<rootDir>/test-utils/mocks/$1',
    '^@tools/test-helpers$': '<rootDir>/../../test-utils/index.tsx',
  },
};
