import { defineConfig } from 'vitest/config';
import { createVitestAliases } from '../../tooling/configs/vitest-aliases';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^lodash-es$/, replacement: 'lodash' },
      { find: /^lodash-es\/(.*)$/, replacement: 'lodash/$1' },
      ...createVitestAliases(__dirname, {
        '@openmrs/esm-framework/src/internal': '../../../node_modules/@openmrs/esm-framework/mock/index.js',
        '@openmrs/esm-framework': '../../../node_modules/@openmrs/esm-framework/mock/index.js',
      }),
    ],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
    },
  },
});
