/**
 * @format
 */

import './shim';
import './src/utils/background/initQueue';
import './src/utils/notification/initNotification';
import 'react-native-reanimated';

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import handleFCM from 'enevti-app/service/firebase/fcm';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  handleFCM(remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
