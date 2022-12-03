module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  dependencies: {
    'react-native-video-processing': {
      platforms: {
        android: null,
      },
    },
    'react-native-k4l-video-trimmer': {
      platforms: {
        ios: null,
      },
    },
  },
};
