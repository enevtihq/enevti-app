import { UNDEFINED_ICON } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createSilentTransaction, updateNonceCache } from 'enevti-app/service/enevti/transaction';
import { createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-types/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { DeliverSecretUI } from 'enevti-types/asset/redeemable_nft/deliver_secret_asset';
import { createSignature, decryptAsymmetric, encryptAsymmetric } from 'enevti-app/utils/cryptography';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { reducePayment } from 'enevti-app/store/middleware/thunk/payment/reducer';
import i18n from 'enevti-app/translations/i18n';
import {
  addTransactionNonceCache,
  subtractTransactionNonceCache,
} from 'enevti-app/store/slices/entities/cache/transactionNonce';
import { getProfilePendingDelivery } from 'enevti-app/service/enevti/profile';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import {
  selectDeliverSecretProcessing,
  setDeliverSecretProcessing,
} from 'enevti-app/store/slices/session/transaction/processing';
import { DeliverSecretPayload } from 'enevti-app/types/ui/task/deliverSecret';
import { cleanPayment } from '../utils/cleanPayment';

type PayDeliverSecretPayload = string;
type PayManualDeliverSecret = undefined;

export const payDeliverSecret = createAsyncThunk<void, PayDeliverSecretPayload, AsyncThunkAPI>(
  'collection/payDeliverSecret',
  async (payload, { dispatch, getState, signal }) => {
    const transactionPayload = [];
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      const isDeliverSecretProcessing = selectDeliverSecretProcessing(getState());
      if (isDeliverSecretProcessing) {
        return;
      }

      dispatch(setDeliverSecretProcessing(true));

      const deliverPending = await getProfilePendingDelivery(payload, undefined, true);
      if (deliverPending.status !== 200) {
        throw Error(i18n.t('error:transactionPreparationFailed'));
      }

      for (const data of deliverPending.data as DeliverSecretPayload[]) {
        const key = await decryptAsymmetric(data.secret.cipher, data.secret.sender);
        const cipher = await encryptAsymmetric(key.data, data.secret.recipient);
        const cipherSignature = await createSignature(cipher);
        const plainSignature = await createSignature(key.data);

        const transactionData: AppTransaction<DeliverSecretUI> = await createSilentTransaction(
          redeemableNftModule.moduleID,
          redeemableNftModule.deliverSecret,
          {
            id: data.id,
            cipher,
            signature: {
              cipher: cipherSignature,
              plain: plainSignature,
            },
          },
          '0',
          signal,
        );

        transactionPayload.push(transactionData);
        dispatch(addTransactionNonceCache());
      }

      dispatch(
        setPaymentState({
          fee: { gas: '0', base: '0', platform: '0', priority: 'normal', loaded: true },
          action: {
            loaded: true,
            type: 'deliverSecret',
            icon: UNDEFINED_ICON,
            name: i18n.t('payment:payDeliverSecretName'),
            description: i18n.t('payment:payDeliverSecretDescription'),
            amount: '0',
            currency: COIN_NAME,
            payload: JSON.stringify(transactionPayload),
            meta: '',
          },
        }),
      );
      dispatch(reducePayment());
    } catch (err) {
      dispatch(setDeliverSecretProcessing(false));
      handleError(err, 'message', true);
      transactionPayload.forEach(() => dispatch(subtractTransactionNonceCache()));
    }
  },
);

export const payManualDeliverSecret = createAsyncThunk<void, PayManualDeliverSecret, AsyncThunkAPI>(
  'collection/payManualDeliverSecret',
  async (_, { dispatch, signal }) => {
    try {
      const myAddress = await getMyAddress();
      await updateNonceCache(signal);
      dispatch(payDeliverSecret(myAddress) as unknown as AnyAction);
    } catch (err) {
      handleError(err);
    }
  },
);
