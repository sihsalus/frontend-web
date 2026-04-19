const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@types$': '<rootDir>/src/types.ts',
    '^@tools/(.*)$': '<rootDir>/tools/$1',
    '^@constants$': '<rootDir>/src/constants.ts',
    '^@resources/(.*)$': '<rootDir>/src/resources/$1',
    '^test-utils$': '<rootDir>/../../test-utils/index.tsx',
    '^test-utils/(.*)$': '<rootDir>/../../test-utils/$1',
  },
};
