import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type ProcessedThisBlockTransactionSessionState = { count: number };

const initialState: ProcessedThisBlockTransactionSessionState = {
  count: 0,
};

const processedThisBlockTransactionSlice = createSlice({
  name: 'processedThisBlockTransaction',
  initialState,
  reducers: {
    setProcessedThisBlockTransaction: (processing, action: PayloadAction<number>) => {
      processing.count = action.payload;
    },
    resetProcessedThisBlockTransaction: processing => {
      processing.count = initialState.count;
    },
  },
});

export const { setProcessedThisBlockTransaction, resetProcessedThisBlockTransaction } =
  processedThisBlockTransactionSlice.actions;
export default processedThisBlockTransactionSlice.reducer;

export const selectProcessedTransactionThisBlock = createSelector(
  (state: RootState) => state.session.transaction.processedThisBlock,
  (processedThisBlock: ProcessedThisBlockTransactionSessionState) => processedThisBlock.count,
);
