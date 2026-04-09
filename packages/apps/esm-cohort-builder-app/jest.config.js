const path = require('path');
const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  setupFilesAfterEnv: [
    ...rootConfig.setupFilesAfterEnv,
    path.resolve(__dirname, 'tools/setup-tests.ts'),
  ],
};
