import { handleError } from 'enevti-app/utils/error/handle';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetTransactionNonceCache } from 'enevti-app/store/slices/entities/cache/transactionNonce';
import { updateNonceCache } from 'enevti-app/service/enevti/transaction';

export const syncTransactionNonce = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'transactionNonce/syncTransactionNonce',
  async (_, { dispatch, signal }) => {
    try {
      dispatch(resetTransactionNonceCache());
      await updateNonceCache(signal, true);
    } catch (err: any) {
      handleError(err, undefined, true);
    }
  },
);
