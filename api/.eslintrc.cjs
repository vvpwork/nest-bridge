module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ['**/node_modules/**', 'dist/**', 'config'],
  rules: {
    // Turn off rules you don't like.
    'class-methods-use-this': 'off',
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreIIFE: true,
        ignoreVoid: true,
      },
    ],
  },
}
