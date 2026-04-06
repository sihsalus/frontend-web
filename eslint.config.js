import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default [
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

      "import/order": ["warn", {
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        "newlines-between": "always",
        alphabetize: { order: "asc" }
      }],

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
      sourceType: "script"
    },

    rules: {
      "no-console": "off"
    }
  }
];