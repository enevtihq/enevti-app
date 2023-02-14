import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import {
  addNotificationUnread,
  setNotificationVersion,
  unshiftNotificationItem,
} from 'enevti-app/store/slices/entities/notification';
import { store } from 'enevti-app/store/state';
import i18n from 'enevti-app/translations/i18n';
import { Collection } from 'enevti-types/chain/collection';
import { createCollectionMention } from 'enevti-app/utils/mention';
import { showNotification } from 'enevti-app/utils/notification';

export default async function newRaffledFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const data = JSON.parse(remoteMessage.data!.payload) as { collection: Collection; total: number };
  const now = Date.now();
  await showNotification({
    id: 'newRaffled',
    actionId: 'newRaffled',
    title: i18n.t('notification:newRaffledTitle'),
    body: i18n.t('notification:newRaffledBody', { collection: data.collection.name }),
  });
  store.dispatch(
    unshiftNotificationItem([
      {
        type: 'newRaffled',
        text: i18n.t('notification:newRaffledBody', {
          collection: createCollectionMention(data.collection),
        }),
        date: now,
        read: false,
      },
    ]),
  );
  store.dispatch(addNotificationUnread());
  store.dispatch(setNotificationVersion(now));
}
