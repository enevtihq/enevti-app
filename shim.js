/* eslint-disable no-undef */
/* eslint-disable dot-notation */
/* eslint-disable curly */
import BackgroundTimer from 'react-native-background-timer';
import { Buffer } from 'buffer';
import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  global.setTimeout = BackgroundTimer.setTimeout.bind(BackgroundTimer);
  global.clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
  global.setInterval = BackgroundTimer.setInterval.bind(BackgroundTimer);
  global.clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);
}

if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');
if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
global.Buffer = Buffer;
global.Buffer.prototype.reverse = function () {
  return require('buffer-reverse')(this, arguments);
};

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env['NODE_ENV'] = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

if (global.navigator && global.navigator.product === 'ReactNative') {
  global.navigator.mimeTypes = '';
  try {
    global.navigator.userAgent = 'ReactNative';
  } catch (e) {
    console.warn(
      'Tried to fake useragent, but failed. This is normal on some devices, you may ignore this error: ' + e.message,
    );
  }
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');

const isomorphicWebcrypto = require('isomorphic-webcrypto');
global.crypto.subtle = isomorphicWebcrypto.subtle;
