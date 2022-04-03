/* eslint-disable @typescript-eslint/no-unused-vars */
import { uploadURItoIPFS } from 'enevti-app/service/ipfs';
import { setPaymentStatus } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { CreateNFTOneKind } from 'enevti-app/types/store/CreateNFTQueue';

export const reducePayCreateNFTOneKind =
  (): AppThunk => async (dispatch, getState) => {
    dispatch({ type: 'payment/reducePayCreateNFTOneKind' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));
    const payload = JSON.parse(
      getState().payment.action.payload,
    ) as CreateNFTOneKind;
    const data = await uploadURItoIPFS(payload.data.uri);
    const cover = payload.state.coverUri
      ? await uploadURItoIPFS(payload.state.coverUri)
      : '';
    const content =
      payload.state.utility === 'content'
        ? await uploadURItoIPFS(payload.state.contentUri)
        : '';
    // TODO: construct new transactionPayload
    // TODO: use Lisk Client to submit transaction to Blockchain
    dispatch(setPaymentStatus({ type: 'success', message: '' }));
  };
