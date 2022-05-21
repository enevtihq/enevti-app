import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type ProcessingTransactionSessionState = { deliverSecret: boolean };

const initialState: ProcessingTransactionSessionState = {
  deliverSecret: false,
};

const processingTransactionSlice = createSlice({
  name: 'processingTransaction',
  initialState,
  reducers: {
    setDeliverSecretProcessing: (processing, action: PayloadAction<boolean>) => {
      processing.deliverSecret = action.payload;
    },
  },
});

export const { setDeliverSecretProcessing } = processingTransactionSlice.actions;
export default processingTransactionSlice.reducer;

export const selectDeliverSecretProcessing = createSelector(
  (state: RootState) => state.session.transaction.proccessing,
  (processing: ProcessingTransactionSessionState) => processing.deliverSecret,
);
