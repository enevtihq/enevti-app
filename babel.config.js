module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-syntax-bigint',
    'react-native-reanimated/plugin',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          'enevti-app': './src',
        },
      },
    ],
    'jest-hoist',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
