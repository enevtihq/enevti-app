import notifee from '@notifee/react-native';
import { onNotificationBackgroundHandler } from './events';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  await onNotificationBackgroundHandler(type, detail);
});
