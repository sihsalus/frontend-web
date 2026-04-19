import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { createVitestAliases } from '../../tooling/configs/vitest-aliases';

export default defineConfig({
  resolve: {
    alias: createVitestAliases(__dirname, {
      '@openmrs/esm-framework/src/internal': '../../test-utils/stubs/esm-framework-internal.mock.tsx',
      '@openmrs/esm-framework': '../../test-utils/stubs/esm-framework.mock.tsx',
    }),
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
