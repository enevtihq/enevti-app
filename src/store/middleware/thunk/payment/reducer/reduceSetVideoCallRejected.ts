import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-types/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { SetVideoCallRejectedUI } from 'enevti-types/asset/redeemable_nft/set_video_call_rejected_asset';

export const reduceSetVideoCallRejected = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reduceSetVideoCallRejected' });
    dispatch(setPaymentStatusInReducer({ action: 'setVideoCallRejected', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<SetVideoCallRejectedUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'setVideoCallRejected',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'setVideoCallRejected', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'setVideoCallRejected', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
