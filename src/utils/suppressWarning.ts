import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  'Require cycle: node_modules/react-native-crypto/index.js',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
  'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
]);
