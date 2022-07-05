import { createTransaction, postTransaction } from 'enevti-app/service/enevti/transaction';
import { DeliverSecretUI } from 'enevti-app/types/core/asset/redeemable_nft/deliver_secret_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { DeliverSecretPayload } from 'enevti-app/types/ui/task/deliverSecret';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createSignature, decryptAsymmetric, encryptAsymmetric } from 'enevti-app/utils/cryptography';
import { handleError } from 'enevti-app/utils/error/handle';
import queue from 'react-native-job-queue';
import runInBackground from '../task/runInBackground';

export default async function deliverSecretWorker(data: { payload: DeliverSecretPayload }) {
  return await runInBackground(async () => {
    try {
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

      const response = await postTransaction(transactionData);
      if (response.status !== 200) {
        throw Error(response.data);
      }
    } catch (err) {
      handleError(err);
    }
  });
}

export function addDeliverSecretJob(data: { payload: DeliverSecretPayload }) {
  queue.addJob('deliverSecret', { payload: data.payload });
}
