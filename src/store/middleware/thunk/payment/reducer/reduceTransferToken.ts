import { selectPaymentActionPayload, setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { TransferTokenUI } from 'enevti-app/types/core/asset/token/transfer_asset';

export const reduceTransferToken = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reduceTransferToken' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<TransferTokenUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(setPaymentStatus({ type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatus({ type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatus({ type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
