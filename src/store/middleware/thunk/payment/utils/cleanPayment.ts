import { selectPaymentStatus, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const cleanPayment = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'payment/cleanPayment',
  async (_, { dispatch, getState }) => {
    const paymentStatus = selectPaymentStatus(getState());
    if (paymentStatus.action !== '') {
      dispatch(setPaymentStatusInReducer({ type: 'cleaned' }));
    }
  },
);
