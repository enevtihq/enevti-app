import { getProfilePendingDelivery } from 'enevti-app/service/enevti/profile';
import { createTransaction, postTransaction } from 'enevti-app/service/enevti/transaction';
import { setDeliverSecretProcessing } from 'enevti-app/store/slices/session/transaction/processing';
import { store } from 'enevti-app/store/state';
import i18n from 'enevti-app/translations/i18n';
import { DeliverSecretUI } from 'enevti-types/asset/redeemable_nft/deliver_secret_asset';
import { AppTransaction } from 'enevti-types/service/transaction';
import { DeliverSecretPayload } from 'enevti-app/types/ui/task/deliverSecret';
import { BLOCK_TIME } from 'enevti-app/utils/constant/identifier';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createSignature, decryptAsymmetric, encryptAsymmetric } from 'enevti-app/utils/cryptography';
import sleep from 'enevti-app/utils/dummy/sleep';
import { isInternetReachable } from 'enevti-app/utils/app/network';
import { showOngoingNotification } from 'enevti-app/utils/notification';
import queue from 'react-native-job-queue';
import { Job } from 'react-native-job-queue/lib/typescript/src/models/Job';
import notifee from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import runInBackground from '../task/runInBackground';
import { EventRegister } from 'react-native-event-listeners';

export default async function deliverSecretWorker(data: { payload: DeliverSecretPayload }) {
  return await runInBackground(async () => {
    const parsedData = data.payload;
    const key = await decryptAsymmetric(parsedData.secret.cipher, parsedData.secret.sender);
    const cipher = await encryptAsymmetric(key.data, parsedData.secret.recipient);
    const cipherSignature = await createSignature(cipher);
    const plainSignature = await createSignature(key.data);

    const transactionData: AppTransaction<DeliverSecretUI> = await createTransaction(
      redeemableNftModule.moduleID,
      redeemableNftModule.deliverSecret,
      {
        id: parsedData.id,
        cipher,
        signature: {
          cipher: cipherSignature,
          plain: plainSignature,
        },
      },
      '0',
    );

    const response = await postTransaction(transactionData, undefined, true);
    if (response.status !== 200) {
      if (!(response.data as string).includes('NFT status is not pending-secret')) {
        throw Error(response.data);
      }
    }
  });
}

export const deliverSecretWorkerOnFailure = async (_job: Job<any>, _error: Error) => {
  await sleep(await BLOCK_TIME());
  addDeliverSecretJob(_job.payload, false);
};

export const checkDeliverSecretWorkerOnFailure = async (_job: Job<any>, _error: Error) => {
  await sleep((await BLOCK_TIME()) * 12);
  await addCheckDeliverSecretJob(_job.payload, false, undefined, false);
};

export const checkDeliverSecretWorker = async (data: { payload: string; silent?: boolean; taskId?: string }) => {
  await isInternetReachable();

  const notifications = await notifee.getDisplayedNotifications();
  const indexs: number[] = [];
  notifications.forEach((t, i) => {
    if (t.notification.data && t.notification.data.type === 'deliverSecretNotif') {
      indexs.push(i);
    }
  });
  await notifee.cancelDisplayedNotifications(indexs.map(i => notifications[i].id ?? ''));

  const pendings = await getProfilePendingDelivery(data.payload, undefined, true);
  if (pendings.status === 200) {
    if (pendings.data.length > 0) {
      if (!data.silent) {
        await showOngoingNotification({
          id: 'deliverSecretNotif',
          title: i18n.t('notification:deliverSecretTask'),
          actionId: 'deliverSecretNotif',
        });
      }
      store.dispatch(setDeliverSecretProcessing(true));
      for (const payload of pendings.data) {
        addDeliverSecretJob({ payload });
      }
      if (data.taskId) {
        const unsubscribe = EventRegister.addEventListener('BackgroundFetchFinish', () => {
          BackgroundFetch.finish(data.taskId);
          EventRegister.removeEventListener(unsubscribe.toString());
        });
      }
    } else {
      if (data.taskId) {
        BackgroundFetch.finish(data.taskId);
      }
    }
  } else {
    if (data.taskId) {
      BackgroundFetch.finish(data.taskId);
    }
    throw Error(pendings.data.toString());
  }
};

export async function addDeliverSecretJob(
  data: { payload: DeliverSecretPayload },
  startQueue: boolean = true,
  option?: { attempts: number; timeout: number; priority: number },
) {
  queue.addJob('deliverSecret', { payload: data.payload }, option, startQueue);
}

export async function addCheckDeliverSecretJob(
  data: { payload: string; taskId?: string },
  startQueue: boolean = true,
  option?: { attempts: number; timeout: number; priority: number },
  showNotification: boolean = true,
) {
  queue.addJob(
    'checkDeliverSecret',
    { payload: data.payload, silent: !showNotification, taskId: data.taskId },
    option,
    startQueue,
  );
}
