import { handleError } from 'enevti-app/utils/error/handle';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import { getProfileNonce } from 'enevti-app/service/enevti/profile';
import {
  resetTransactionNonceCache,
  setTransactionNonceCache,
  setTransactionNonceCacheSynced,
} from 'enevti-app/store/slices/entities/cache/transactionNonce';

export const syncTransactionNonce = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'transactionNonce/syncTransactionNonce',
  async (_, { dispatch, signal }) => {
    try {
      dispatch(resetTransactionNonceCache());
      const myAddress = await getMyAddress();
      const nonce = await getProfileNonce(myAddress, signal);
      if (nonce.status === 200) {
        dispatch(setTransactionNonceCache(Number(nonce.data)));
        dispatch(setTransactionNonceCacheSynced());
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);
