import { UNDEFINED_ICON } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentFee, setPaymentStatus, setPaymentAction } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createSilentTransaction } from 'enevti-app/service/enevti/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { DeliverSecretUI } from 'enevti-app/types/core/asset/redeemable_nft/deliver_secret_asset';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { createSignature, decryptAsymmetric, encryptAsymmetric } from 'enevti-app/utils/cryptography';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { reducePayment } from 'enevti-app/store/middleware/thunk/payment/reducer';
import i18n from 'enevti-app/translations/i18n';
import { subtractTransactionNonceCache } from 'enevti-app/store/slices/entities/cache/transactionNonce';

type PayDeliverSecretPayload = { id: string; secret: NFT['redeem']['secret'] };

export const payDeliverSecret = createAsyncThunk<void, PayDeliverSecretPayload, AsyncThunkAPI>(
  'collection/payDeliverSecret',
  async (payload, { dispatch, signal }) => {
    try {
      console.log('deliver secret creator');
      dispatch(setPaymentStatus({ type: 'initiated', message: '' }));

      const key = await decryptAsymmetric(payload.secret.cipher, payload.secret.sender);
      const cipher = await encryptAsymmetric(key.data, payload.secret.recipient);
      const cipherSignature = await createSignature(cipher);
      const plainSignature = await createSignature(key.data);
      console.log('secret for new owner', cipher);

      const transactionPayload: AppTransaction<DeliverSecretUI> = await createSilentTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.deliverSecret,
        {
          id: payload.id,
          cipher,
          signature: {
            cipher: cipherSignature,
            plain: plainSignature,
          },
        },
        '0',
        signal,
      );

      dispatch(setPaymentFee({ gas: '0', platform: '0' }));
      dispatch(
        setPaymentAction({
          type: 'deliverSecret',
          icon: UNDEFINED_ICON,
          name: i18n.t('payment:payDeliverSecretName'),
          description: i18n.t('payment:payDeliverSecretDescription'),
          amount: '0',
          currency: COIN_NAME,
          payload: JSON.stringify(transactionPayload),
        }),
      );
      dispatch(reducePayment());
    } catch (err) {
      handleError(err);
      dispatch(subtractTransactionNonceCache());
      dispatch(
        setPaymentStatus({
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
