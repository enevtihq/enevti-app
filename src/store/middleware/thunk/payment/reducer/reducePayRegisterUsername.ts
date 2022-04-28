import { selectPaymentActionPayload, setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { RegisterUsernameUI } from 'enevti-app/types/core/asset/chain/register_username';
import { postTransaction } from 'enevti-app/service/enevti/transaction';

export const reducePayRegisterUsername = (): AppThunk => async (dispatch, getState) => {
  dispatch(showModalLoader());
  dispatch({ type: 'payment/reducePayRegisterUsername' });
  dispatch(setPaymentStatus({ type: 'process', message: '' }));

  const payload = JSON.parse(
    selectPaymentActionPayload(getState()),
  ) as AppTransaction<RegisterUsernameUI>;

  const response = await postTransaction(payload);
  if (response.status === 200) {
    dispatch(setPaymentStatus({ type: 'success', message: '' }));
  } else {
    dispatch(setPaymentStatus({ type: 'error', message: response.data }));
  }

  dispatch(hideModalLoader());
};
