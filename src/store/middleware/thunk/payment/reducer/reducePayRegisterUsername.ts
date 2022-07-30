import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { RegisterUsernameUI } from 'enevti-app/types/core/asset/chain/register_username';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';

export const reducePayRegisterUsername = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayRegisterUsername' });
    dispatch(setPaymentStatusInReducer({ action: 'registerUsername', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<RegisterUsernameUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'registerUsername',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'registerUsername', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'registerUsername', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
