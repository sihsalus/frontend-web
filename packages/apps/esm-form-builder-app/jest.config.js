const rootConfig = require('../../jest.config.js');
const { createAppJestConfig } = require('../../tooling/configs/jest-aliases');

module.exports = createAppJestConfig(rootConfig, '<rootDir>', {
  '@hooks/*': 'src/hooks/*',
  '@types': 'src/types.ts',
  '@tools/*': 'tools/*',
  '@constants': 'src/constants.ts',
  '@resources/*': 'src/resources/*',
  'test-utils': '../../test-utils/index.tsx',
  'test-utils/*': '../../test-utils/*',
});
