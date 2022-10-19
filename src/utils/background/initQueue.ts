import BackgroundService from 'react-native-background-actions';
import queue, { Worker } from 'react-native-job-queue';
import deliverSecretWorker, {
  addCheckDeliverSecretJob,
  addDeliverSecretJob,
  checkDeliverSecretWorkerOnFailure,
  checkDeliverSecretWorker,
  deliverSecretWorkerOnFailure,
} from 'enevti-app/utils/background/worker/deliverSecretWorker';
import { getProfilePendingDelivery } from 'enevti-app/service/enevti/profile';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import sleep from '../dummy/sleep';
import { BLOCK_TIME } from '../constant/identifier';
import { cancelNotification, setIOSBadgeCount } from '../notification';
import { store } from 'enevti-app/store/state';
import { setDeliverSecretProcessing } from 'enevti-app/store/slices/session/transaction/processing';
import { EventRegister } from 'react-native-event-listeners';

queue.configure({
  concurrency: 1,
  onQueueFinish: async () => {
    try {
      await sleep(await BLOCK_TIME());
      const myAddress = await getMyAddress();
      const pendingPayload = await getProfilePendingDelivery(myAddress, undefined, true);
      if (pendingPayload.status === 200) {
        if (pendingPayload.data.length > 0) {
          for (const payload of pendingPayload.data) {
            addDeliverSecretJob({ payload });
          }
        } else {
          await cancelNotification('deliverSecretNotif');
          await setIOSBadgeCount(0);
          store.dispatch(setDeliverSecretProcessing(false));
          await BackgroundService.stop();
          EventRegister.emit('BackgroundFetchFinish');
          EventRegister.removeEventListener('BackgroundFetchFinish');
        }
      } else {
        await addCheckDeliverSecretJob({ payload: myAddress }, true, { attempts: 5, timeout: 0, priority: 0 }, false);
      }
    } catch (err) {
      store.dispatch(setDeliverSecretProcessing(false));
      await setIOSBadgeCount(0);
      await cancelNotification('deliverSecretNotif');
      await BackgroundService.stop();
    }
  },
});

queue.addWorker(
  new Worker(
    'deliverSecret',
    async payload => {
      return await deliverSecretWorker(payload);
    },
    { onFailure: deliverSecretWorkerOnFailure },
  ),
);

queue.addWorker(
  new Worker(
    'checkDeliverSecret',
    async payload => {
      return await checkDeliverSecretWorker(payload);
    },
    { onFailure: checkDeliverSecretWorkerOnFailure },
  ),
);
