import { LogBox } from 'react-native';

__DEV__ &&
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    'Require cycle: node_modules/react-native-crypto/index.js',
    'Sending `onAnimatedValueUpdate` with no listeners registered.',
    'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
    'Require cycle: node_modules/@liskhq/lisk-validator/node_modules/semver/classes/comparator.js',
    'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
    "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
    '`new NativeEventEmitter()` was called with a non-null argument',
  ]);
