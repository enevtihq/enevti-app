import { resetPaymentState, selectPaymentActionPayload } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postSilentTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { DeliverSecretUI } from 'enevti-app/types/core/asset/redeemable_nft/deliver_secret_asset';
import { subtractTransactionNonceCache } from 'enevti-app/store/slices/entities/cache/transactionNonce';
import { setDeliverSecretProcessing } from 'enevti-app/store/slices/session/transaction/processing';
import { initProfile } from '../../ui/view/profile';
import { BLOCK_TIME } from 'enevti-app/utils/constant/identifier';
import { AnyAction } from '@reduxjs/toolkit';
import { setMyProfileViewPending } from 'enevti-app/store/slices/ui/view/myProfile';

export const reducePayDeliverSecret = (): AppThunk => async (dispatch, getState) => {
  const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<DeliverSecretUI>[];
  try {
    dispatch({ type: 'payment/reducePayDeliverSecret' });

    const responseStatusArray = [];
    const responseErrorSet = new Set<string>();
    const transactionIdSet = new Set<string>();

    for (const data of payload) {
      const response = await postSilentTransaction(data);
      responseStatusArray.push(response.status);
      if (response.status !== 200) {
        responseErrorSet.add(response.data);
      } else {
        transactionIdSet.add(response.data.transactionId);
      }
    }

    if (responseStatusArray.every(value => value === 200)) {
      dispatch(setMyProfileViewPending(0));
    } else {
      throw Error(JSON.stringify([...responseErrorSet]));
    }
  } catch (err: any) {
    handleError(err, 'message', true);
    payload.forEach(() => dispatch(subtractTransactionNonceCache()));
  } finally {
    dispatch(setDeliverSecretProcessing(false));
    dispatch(resetPaymentState());
    setTimeout(() => dispatch(initProfile() as unknown as AnyAction), await BLOCK_TIME());
  }
};
