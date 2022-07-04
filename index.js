/**
 * @format
 */

import './shim';
import 'react-native-reanimated';
import React from 'react';
import { AppRegistry } from 'react-native';

import App from './src/App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(new Date().toISOString());
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
