import { selectPaymentActionPayload } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postSilentTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { DeliverSecretUI } from 'enevti-app/types/core/asset/redeemable_nft/deliver_secret_asset';
import { subtractTransactionNonceCache } from 'enevti-app/store/slices/entities/cache/transactionNonce';

export const reducePayDeliverSecret = (): AppThunk => async (dispatch, getState) => {
  try {
    console.log('deliver secret reducer');
    dispatch({ type: 'payment/reducePayDeliverSecret' });

    const responseStatusArray = [];
    const responseErrorSet = new Set<string>();
    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<DeliverSecretUI>[];

    for (const data of payload) {
      const response = await postSilentTransaction(data);
      responseStatusArray.push(response.status);
      if (response.status !== 200) {
        responseErrorSet.add(response.data);
      }
    }

    if (responseStatusArray.every(value => value === 200)) {
      console.log('deliver secret success');
    } else {
      throw Error(JSON.stringify([...responseErrorSet]));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(subtractTransactionNonceCache());
  }
};
