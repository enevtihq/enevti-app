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

export default async function wonRaffleFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const data = JSON.parse(remoteMessage.data!.payload) as { collection: Collection; total: number };
  const now = Date.now();
  await showNotification({
    id: 'wonRaffle',
    actionId: 'wonRaffle',
    title: i18n.t('notification:wonRaffleTitle'),
    body: i18n.t('notification:wonRaffleBody', { collection: data.collection.name }),
  });
  store.dispatch(
    unshiftNotificationItem([
      {
        type: 'newRaffled',
        text: i18n.t('notification:wonRaffleBody', { collection: createCollectionMention(data.collection) }),
        date: now,
        read: false,
      },
    ]),
  );
  store.dispatch(addNotificationUnread());
  store.dispatch(setNotificationVersion(now));
}
