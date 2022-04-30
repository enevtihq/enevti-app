import { selectPaymentActionPayload, setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AddStakeUI } from 'enevti-app/types/core/asset/chain/add_stake_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';

export const reducePayAddStake = (): AppThunk => async (dispatch, getState) => {
  dispatch(showModalLoader());
  dispatch({ type: 'payment/reducePayAddStake' });
  dispatch(setPaymentStatus({ type: 'process', message: '' }));

  const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<AddStakeUI>;

  const response = await postTransaction(payload);
  if (response.status === 200) {
    dispatch(setPaymentStatus({ type: 'success', message: '' }));
  } else {
    dispatch(setPaymentStatus({ type: 'error', message: response.data }));
  }

  dispatch(hideModalLoader());
};
