const rootConfig = require('../../jest.config.js');

module.exports = {
	...rootConfig,
	setupFiles: [...(rootConfig.setupFiles ?? []), '<rootDir>/src/setup-globals.ts'],
};
