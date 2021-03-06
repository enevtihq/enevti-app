module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  globals: {
    JSX: true,
    AbortController: true,
    Buffer: true,
    Response: true,
  },
  env: {
    es2020: true,
  },
};
