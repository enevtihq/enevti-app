/* eslint-disable @typescript-eslint/no-unused-vars */
import { setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { MintNFTProps } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_asset';
import { handleError } from 'enevti-app/utils/error/handle';

export const reducePayMintCollection = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayMintCollection' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));

    const payload = JSON.parse(getState().payment.action.payload) as MintNFTProps;
    await sleep(5000);
    // TODO: use Lisk Client to submit transaction to Blockchain

    dispatch(setPaymentStatus({ type: 'success', message: '' }));
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatus({ type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
