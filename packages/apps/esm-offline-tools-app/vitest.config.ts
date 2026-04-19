import { defineConfig } from 'vitest/config';
import { createVitestAliases } from '../../tooling/configs/vitest-aliases';

export default defineConfig({
  resolve: {
    alias: createVitestAliases(__dirname, {
      '@openmrs/esm-framework': '../../../node_modules/@openmrs/esm-framework/mock/index.js',
    }),
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
