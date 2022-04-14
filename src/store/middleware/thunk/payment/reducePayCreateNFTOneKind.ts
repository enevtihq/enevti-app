/* eslint-disable @typescript-eslint/no-unused-vars */
import { uploadURItoIPFS } from 'enevti-app/service/ipfs';
import { setPaymentStatus } from 'enevti-app/store/slices/payment';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk } from 'enevti-app/store/state';
import { CreateNFTOneKind } from 'enevti-app/types/store/CreateNFTQueue';

export const reducePayCreateNFTOneKind =
  (): AppThunk => async (dispatch, getState) => {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayCreateNFTOneKind' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));

    const payload = JSON.parse(
      getState().payment.action.payload,
    ) as CreateNFTOneKind;
    const data = await uploadURItoIPFS(payload.data.uri);
    const cover = payload.state.coverUri
      ? await uploadURItoIPFS(payload.state.coverUri)
      : '';

    // TODO: parse schedule in local format (new Date(y, m, d, h, m)), then store in UTC (getUTCHours())
    // TODO: check if folder for content upload is exist
    // TODO: prepare encrypted content file to upload to IPFS
    const content =
      payload.state.utility === 'content'
        ? await uploadURItoIPFS(payload.state.contentUri)
        : '';

    // TODO: construct new transactionPayload
    // TODO: use Lisk Client to submit transaction to Blockchain

    dispatch(setPaymentStatus({ type: 'success', message: '' }));
    dispatch(hideModalLoader());
  };
