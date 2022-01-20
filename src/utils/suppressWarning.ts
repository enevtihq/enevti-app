import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'Require cycle: node_modules/react-native-crypto/index.js',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);
