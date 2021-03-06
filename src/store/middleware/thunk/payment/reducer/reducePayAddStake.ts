import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AddStakeUI } from 'enevti-app/types/core/asset/chain/add_stake_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';

export const reducePayAddStake = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayAddStake' });
    dispatch(setPaymentStatusInReducer({ action: 'addStake', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<AddStakeUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(setPaymentStatusInReducer({ action: 'addStake', type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'addStake', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'addStake', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
