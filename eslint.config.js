import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    linterOptions: {
      // The repo intentionally contains a few legacy eslint-disable directives.
      // We don't want the lint job to fail because of unused disables.
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // v7 migration guardrails (initial enforcement set):
      // - platform must not import features/products
      // - features must not import products
      // - products should avoid importing other products (softly enforced by convention for now)
    },
  },
  {
    files: ['src/platform/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@features/*',
            '@products/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@products/*',
          ],
        },
      ],
    },
  },
];

