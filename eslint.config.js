// ESLint v9+ config for TypeScript n8n community node

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-explicit-any': 'off',
      'explicit-module-boundary-types': 'off',
      'no-unused-vars': 'warn'
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
]; 