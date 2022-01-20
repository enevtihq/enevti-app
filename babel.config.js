module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['@babel/plugin-syntax-bigint'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
