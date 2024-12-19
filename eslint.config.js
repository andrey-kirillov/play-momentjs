import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'semi': ['error', 'always']  // Requires semicolons at the end of statements
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ["**/*.test.{js,ts,jsx,tsx}"],
    languageOptions: { globals: globals.jest }
  }
];