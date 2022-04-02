/* eslint-disable @typescript-eslint/no-unused-vars */
import { MintCollectionTransaction } from 'enevti-app/types/service/enevti/transaction';
import { setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { sleep } from 'enevti-app/service/enevti/dummy';

export const reducePayMintCollection =
  (): AppThunk => async (dispatch, getState) => {
    dispatch({ type: 'payment/reducePayMintCollection' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));
    const payload = JSON.parse(
      getState().payment.action.payload,
    ) as MintCollectionTransaction;
    await sleep(5000);
    // TODO: use Lisk Client to submit transaction to Blockchain
    dispatch(setPaymentStatus({ type: 'success', message: '' }));
  };
