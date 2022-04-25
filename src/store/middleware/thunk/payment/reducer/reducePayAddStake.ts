/* eslint-disable @typescript-eslint/no-unused-vars */
import { setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AddStakeAsset } from 'enevti-app/types/core/asset/add_stake_asset';

export const reducePayAddStake = (): AppThunk => async (dispatch, getState) => {
  dispatch(showModalLoader());
  dispatch({ type: 'payment/reducePayAddStake' });
  dispatch(setPaymentStatus({ type: 'process', message: '' }));

  const payload = JSON.parse(getState().payment.action.payload) as AddStakeAsset;
  await sleep(5000);
  // TODO: use Lisk Client to submit transaction to Blockchain

  dispatch(setPaymentStatus({ type: 'success', message: '' }));
  dispatch(hideModalLoader());
};
