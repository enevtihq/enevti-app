import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const initialState = {
  value: 0,
  synced: false,
};

const transactionNonceEntitySlice = createSlice({
  name: 'transactionNonce',
  initialState,
  reducers: {
    setTransactionNonceCache: (transactionNonce, action: PayloadAction<number>) => {
      transactionNonce.value = action.payload;
    },
    setTransactionNonceCacheSynced: transactionNonce => {
      transactionNonce.synced = true;
    },
    addTransactionNonceCache: transactionNonce => {
      transactionNonce.value += 1;
    },
    resetTransactionNonceCache: () => {
      return initialState;
    },
  },
});

export const {
  setTransactionNonceCache,
  resetTransactionNonceCache,
  addTransactionNonceCache,
  setTransactionNonceCacheSynced,
} = transactionNonceEntitySlice.actions;
export default transactionNonceEntitySlice.reducer;

export const selectTransactionNonce = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.transactionNonce.value,
);

export const isTransactionNonceSynced = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.transactionNonce.synced,
);
