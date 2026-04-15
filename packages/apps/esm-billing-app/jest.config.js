const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
