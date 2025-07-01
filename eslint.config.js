import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    ignores: ["dist", "node_modules", "coverage", "build"],
    languageOptions: {
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
        __VERSION__: 'readonly',
      },
    },
  },
  tseslint.configs.recommended,
]);