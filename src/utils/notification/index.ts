import notifee, { AndroidImportance } from '@notifee/react-native';

type NotificationArg = { id?: string; title: string; body?: string };

export async function showNotification({ id, title, body }: NotificationArg) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  return await notifee.displayNotification({
    id,
    title,
    body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function showOngoingNotification({ id, title, body }: NotificationArg) {
  await notifee.requestPermission();
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
        id: 'default',
      },
    },
  });
}

export async function cancelNotification(notificationId: string) {
  await notifee.cancelNotification(notificationId);
}
