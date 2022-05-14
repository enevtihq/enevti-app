import { selectPaymentActionPayload, setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { DeliverSecretUI } from 'enevti-app/types/core/asset/redeemable_nft/deliver_secret_asset';

export const reducePayDeliverSecret = (): AppThunk => async (dispatch, getState) => {
  try {
    console.log('deliver secret reducer');
    dispatch({ type: 'payment/reducePayDeliverSecret' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<DeliverSecretUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(setPaymentStatus({ type: 'success', message: '' }));
      console.log('deliver secret success');
    } else {
      dispatch(setPaymentStatus({ type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatus({ type: 'error', message: err.message }));
  }
};
