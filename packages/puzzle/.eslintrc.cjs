module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'airbnb-base'],
  ignorePatterns: ['dist', '.*'],
  parser: '@typescript-eslint/parser',
  rules: {
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'arrow-parens': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
      },
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', '*.d.ts'],
};
