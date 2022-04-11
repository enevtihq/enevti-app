module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  globals: {
    JSX: true,
    AbortController: true,
    Buffer: true,
  },
  env: {
    es2020: true,
  },
};
