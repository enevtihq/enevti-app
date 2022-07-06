import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import BackgroundService from 'react-native-background-actions';
import { addCheckDeliverSecretJob } from 'enevti-app/utils/background/worker/deliverSecretWorker';
import i18n from 'enevti-app/translations/i18n';
import sleep from 'enevti-app/utils/dummy/sleep';
import queue from 'react-native-job-queue';

export default async function deliverSecretNotifFCMHandler(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  if (remoteMessage.data && !BackgroundService.isRunning() && !queue.isRunning) {
    await deliverSecretNotifFCMHandlerStart(remoteMessage);
  }
}

export async function deliverSecretNotifFCMHandlerStart(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  await BackgroundService.start(deliverSecretTask, deliverSecretActionOption(remoteMessage.data!.payload));
}

const deliverSecretTask = async (taskDataArguments: { payload: string } | undefined) => {
  const payload = taskDataArguments ? taskDataArguments.payload : undefined;
  if (payload) {
    await addCheckDeliverSecretJob({ payload });
  }
  while (BackgroundService.isRunning() || queue.isRunning) {
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
    payload,
  },
});
