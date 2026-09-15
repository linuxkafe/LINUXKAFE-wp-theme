/**
 * ESLint Flat Config — linuxkafe Gamification
 * Suporta ES Modules, modern JS, browser globals
 * Substitui .eslintrc (legacy)
 */

import js from '@eslint/js';
import globals from 'globals';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.min.js',
      'package-lock.json',
      'playwright-report/**',
      'test-results/**',
      // Legacy files with tabs/different style
      'js/autoscroll.js',
      'js/navigation.js',
      // shell.js has valid syntax but ESLint parser issue
      'js/shell.js',
    ],
  },

  // Base recommended rules
  js.configs.recommended,

  // Browser + ES2022 globals
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        // WordPress globals
        wp: 'readonly',
        ajaxurl: 'readonly',
        lkGamificationConfig: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },
  },

  // Rules for gamification modules (js/*.js)
  {
    files: ['js/*.js'],
    rules: {
      // Style
      'indent': ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Best practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',

      // ES Modules - using native ESM, no import plugin
      // 'import/no-unresolved': 'off',
      // 'import/extensions': ['error', 'always', { js: 'never' }],

      // Complexity
      'max-depth': ['warn', 4],
      'max-lines-per-function': ['warn', 80],
      'complexity': ['warn', 10],

      // Disable conflicting rules for ESM
      'strict': 'off', // Modules are strict by default
    },
  },

  // Test files (Playwright)
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'max-lines-per-function': 'off',
    },
  },

  // Config files
  {
    files: ['*.config.js', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];