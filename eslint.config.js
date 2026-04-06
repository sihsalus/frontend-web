const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.rspack/**",
      "**/.cache/**",
      "**/.turbo/**",
      "**/coverage/**"
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["packages/apps/**/*.{ts,tsx}"],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module"
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      import: importPlugin
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      "react-hooks/exhaustive-deps": "warn",

      "import/order": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/libs/**/*.ts"],

    languageOptions: {
      parser: tseslint.parser
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error"]
    }
  },

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        process: "readonly"
      }
    },

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off"
    }
  }
];