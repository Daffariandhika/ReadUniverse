module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
  plugins: [
    'react',
    'react-refresh',
    'import',
    'jsx-a11y',
    'sort-destructure-keys',
  ],
  rules: {
    'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
        ignoreCase: true,
      },
    ],
    'react/sort-prop-types': [
      'warn',
      {
        callbacksLast: true,
        requiredFirst: true,
        sortShapeProp: true,
        ignoreCase: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index']],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: '@/**', group: 'internal', position: 'after' },
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/no-autofocus': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-named-as-default': 'off',
  },
};
