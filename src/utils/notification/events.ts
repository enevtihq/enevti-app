import notifee, { EventDetail, EventType } from '@notifee/react-native';

export async function onNotificationBackgroundHandler(_type: EventType, _detail: EventDetail) {
  switch (_type) {
    case EventType.PRESS:
      if (_detail.notification && _detail.notification.android && _detail.notification.android.ongoing) {
        await notifee.displayNotification(_detail.notification);
      }
      break;
    default:
      break;
  }
}

export async function onNotificationForegroundHandler(_type: EventType, _detail: EventDetail) {}
