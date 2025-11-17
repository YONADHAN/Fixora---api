import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Ignore build folders
  {
    ignores: ['node_modules', 'dist', 'build', 'eslint.config.mjs'],
  },

  // JS recommended config
  js.configs.recommended,

  // TS recommended config (must spread!)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      globals: {
        ...globals.node,
      },
    },

    rules: {
      /**
       * 🟢 CLEAN ARCHITECTURE SAFE DEFAULTS
       */

      // Allow unused DI injections, DTOs, interfaces when prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Disable base rule
      'no-unused-vars': 'off',

      // Allow DI empty functions
      '@typescript-eslint/no-empty-function': 'off',

      // Relax any
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],

      // Allow ts-ignore in infra
      '@typescript-eslint/ban-ts-comment': 'off',

      // Allow expression-based validation patterns
      '@typescript-eslint/no-unused-expressions': 'off',

      // Allow console in backend
      'no-console': 'off',
    },
  },

  // Prettier should always go last
  prettierConfig,
]
