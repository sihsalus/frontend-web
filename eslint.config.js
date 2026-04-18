const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');
const testingLibrary = require('eslint-plugin-testing-library');
const jestDom = require('eslint-plugin-jest-dom');
const playwright = require('eslint-plugin-playwright');

const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/*.d.ts',
  '**/.rspack/**',
  '**/.cache/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/form-engine-lib-runtime.js',
];

const commonGlobals = {
  require: 'readonly',
  module: 'readonly',
  __dirname: 'readonly',
  console: 'readonly',
  process: 'readonly',
};

const browserGlobals = {
  ...commonGlobals,
  CustomEvent: 'readonly',
  document: 'readonly',
  window: 'readonly',
};

const strictTsRules = {
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-redeclare': 'off',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'prefer-const': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-redeclare': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
};

module.exports = [
  {
    ignores: ignorePatterns,
  },

  js.configs.recommended,

  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: commonGlobals,
    },
    rules: {
      'no-undef': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: browserGlobals,
      parserOptions: {},
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
    },
    rules: strictTsRules,
  },

  {
    files: ['packages/libs/esm-audit-logger/**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        atob: 'readonly',
        btoa: 'readonly',
        crypto: 'readonly',
        indexedDB: 'readonly',
        navigator: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        URL: 'readonly',
      },
    },
  },

  {
    files: ['**/*.{js,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: {
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        it: 'readonly',
        test: 'readonly',
      },
    },
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
    ...testingLibrary.configs['flat/react'],
    ...jestDom.configs['flat/recommended'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/__mocks__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/e2e/**/*.{ts,tsx}', '**/*e2e*.{ts,tsx}'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'off',
    },
  },

  {
    files: ['packages/tooling/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: [
      '**/__mocks__/**/*.js',
      '**/jest.config.js',
      '**/rspack.config.js',
      '**/setup-tests.js',
      '**/setupTests.js',
      '**/postcss.config.js',
      'packages/tooling/**/*.js',
      'packages/**/*.cjs',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: commonGlobals,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  {
    files: ['packages/apps/**/tools/**/*.mjs', 'packages/libs/**/setup-tests.js', 'packages/libs/**/vitest.config.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
];
