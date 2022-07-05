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
import BackgroundService from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  const { delay } = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; i < 30; i++) {
      console.log(i);
      await sleep(delay);
    }
    await BackgroundService.stop();
    console.log('after stop');
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000,
  },
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(new Date().toISOString());
  console.log('Message handled in the background!', remoteMessage);
  await BackgroundService.start(veryIntensiveTask, options);
  await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
