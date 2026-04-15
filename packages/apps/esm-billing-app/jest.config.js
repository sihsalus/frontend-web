const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    // billing app mocks live in __mocks__/ but tests import them as 'mocks/*'
    '^mocks/(.*)$': '<rootDir>/__mocks__/$1',
  },
};
