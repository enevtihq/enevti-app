import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import BackgroundService from 'react-native-background-actions';
import { DeliverSecretPayload } from 'enevti-app/types/ui/task/deliverSecret';
import { addDeliverSecretJob } from 'enevti-app/utils/background/worker/deliverSecretWorker';
import i18n from 'enevti-app/translations/i18n';
import sleep from 'enevti-app/utils/dummy/sleep';

export default async function deliverSecretNotifFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  if (remoteMessage.data) {
    await BackgroundService.start(deliverSecretTask, deliverSecretActionOption(remoteMessage.data.payload));
    await BackgroundService.updateNotification({ taskDesc: i18n.t('notification:deliverSecretTaskDesc') });
  }
}

const deliverSecretTask = async (taskDataArguments: { payload: DeliverSecretPayload[] } | undefined) => {
  const payload = taskDataArguments ? taskDataArguments.payload : undefined;
  if (payload) {
    for (const data of payload) {
      addDeliverSecretJob({ payload: data });
    }
  }
  while (BackgroundService.isRunning()) {
    await sleep(5000);
  }
};

export const deliverSecretActionOption = (payload: string) => ({
  taskName: 'deliverSecret',
  taskTitle: i18n.t('notification:deliverSecretTaskTitle'),
  taskDesc: i18n.t('notification:deliverSecretTaskDesc'),
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'enevti://',
  parameters: {
    payload: JSON.parse(payload) as DeliverSecretPayload[],
  },
});
