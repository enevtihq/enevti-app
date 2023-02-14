import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-types/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { TransferTokenUI } from 'enevti-types/asset/token/transfer_asset';

export const reduceTransferToken = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reduceTransferToken' });
    dispatch(setPaymentStatusInReducer({ action: 'transferToken', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<TransferTokenUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({ action: 'transferToken', type: 'success', message: response.data.transactionId }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'transferToken', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'transferToken', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
