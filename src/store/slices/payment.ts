import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import {
  PaymentAction,
  PaymentHeader,
  PaymentItem,
  PaymentState,
} from '../../types/store/Payment';
import { RootState } from '../state';

const initialState: PaymentState = {
  show: false,
  header: {
    icon: iconMap.dollar,
    name: '',
    description: '',
  },
  item: [],
  action: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState: initialState as PaymentState,
  reducers: {
    showPayment: payment => {
      payment.show = true;
    },
    hidePayment: payment => {
      payment.show = false;
    },
    setPaymentHeader: (payment, action: PayloadAction<PaymentHeader>) => {
      payment.header.icon = action.payload.icon;
      payment.header.name = action.payload.name;
      payment.header.description = action.payload.description;
    },
    clearPaymentHeader: payment => {
      payment.header.icon = initialState.header.icon;
      payment.header.name = initialState.header.name;
      payment.header.description = initialState.header.description;
    },
    addPaymentItem: (payment, action: PayloadAction<PaymentItem>) => {
      payment.item.push(action.payload);
    },
    clearPaymentItem: payment => {
      payment.item = [];
    },
    addPaymentAction: (payment, action: PayloadAction<PaymentAction>) => {
      payment.action.push(action.payload);
    },
    clearPaymentAction: payment => {
      payment.action = [];
    },
    clearPaymentState: () => {
      return initialState;
    },
  },
});

export const {
  showPayment,
  hidePayment,
  setPaymentHeader,
  clearPaymentHeader,
  addPaymentItem,
  clearPaymentItem,
  addPaymentAction,
  clearPaymentAction,
  clearPaymentState,
} = paymentSlice.actions;
export default paymentSlice.reducer;

export const selectPaymentState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment,
);
