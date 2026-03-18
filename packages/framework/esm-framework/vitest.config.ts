import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Prevent multiple React instances (e.g. from swr's nested node_modules)
    // which cause "Cannot read properties of null (reading 'useContext')" errors.
    dedupe: ['react', 'react-dom', 'swr'],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
