import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { SetVideoCallAnsweredUI } from 'enevti-app/types/core/asset/redeemable_nft/set_video_call_answered_asset';

export const reduceSetVideoCallAnswered = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reduceSetVideoCallAnswered' });
    dispatch(setPaymentStatusInReducer({ action: 'setVideoCallAnswered', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<SetVideoCallAnsweredUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'setVideoCallAnswered',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'setVideoCallAnswered', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'setVideoCallAnswered', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
