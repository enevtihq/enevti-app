import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

type NotificationArg = { id?: string; title: string; body?: string; actionId: string };

export async function showNotification({ id, title, body, actionId }: NotificationArg) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  return await notifee.displayNotification({
    id,
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: actionId,
      },
    },
  });
}

export async function showOngoingNotification({ id, title, body, actionId }: NotificationArg) {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Channel',
    importance: AndroidImportance.HIGH,
  });
  return await notifee.displayNotification({
    id,
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      ongoing: true,
      progress: {
        max: 10,
        current: 5,
        indeterminate: true,
      },
      pressAction: {
        id: actionId,
      },
    },
  });
}

export async function cancelNotification(notificationId: string) {
  await notifee.cancelNotification(notificationId);
}

export async function setIOSBadgeCount(count: number) {
  if (Platform.OS === 'ios') {
    await notifee.setBadgeCount(count);
  }
}
