import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  PaymentAction,
  PaymentFee,
  PaymentState,
  PaymentStatus,
} from 'enevti-app/types/ui/store/Payment';
import { RootState } from 'enevti-app/store/state';

const initialState: PaymentState = {
  show: false,
  mode: 'full',
  status: {
    type: 'idle',
    message: '',
  },
  action: {
    loaded: false,
    type: '',
    icon: iconMap.dollar,
    name: '',
    description: '',
    details: '',
    amount: '0',
    currency: '',
    payload: '',
  },
  fee: {
    loaded: false,
    gas: '0',
    platform: '0',
  },
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
    setPaymentMode: (payment, action: PayloadAction<PaymentState['mode']>) => {
      payment.mode = action.payload;
    },
    setPaymentStatus: (payment, action: PayloadAction<PaymentStatus>) => {
      payment.status.type = action.payload.type;
      payment.status.message = action.payload.message;
    },
    resetPaymentStatus: payment => {
      payment.status.type = initialState.status.type;
      payment.status.message = initialState.status.message;
    },
    setPaymentActionType: (payment, action: PayloadAction<PaymentAction['type']>) => {
      payment.action.type = action.payload;
    },
    setPaymentAction: (payment, action: PayloadAction<Omit<PaymentAction, 'loaded'>>) => {
      payment.action.loaded = true;
      payment.action.type = action.payload.type;
      payment.action.icon = action.payload.icon;
      payment.action.name = action.payload.name;
      payment.action.description = action.payload.description;
      payment.action.details = action.payload.details;
      payment.action.amount = action.payload.amount;
      payment.action.currency = action.payload.currency;
      payment.action.payload = action.payload.payload;
    },
    resetPaymentAction: payment => {
      payment.action.loaded = false;
      payment.action.type = initialState.action.type;
      payment.action.icon = initialState.action.icon;
      payment.action.name = initialState.action.name;
      payment.action.description = initialState.action.description;
      payment.action.amount = initialState.action.amount;
      payment.action.currency = initialState.action.currency;
      payment.action.payload = initialState.action.payload;
    },
    setPaymentFee: (payment, action: PayloadAction<Omit<PaymentFee, 'loaded'>>) => {
      payment.fee.loaded = true;
      payment.fee.gas = action.payload.gas;
      payment.fee.platform = action.payload.platform;
    },
    resetPaymentFee: payment => {
      payment.fee.loaded = false;
      payment.fee.gas = initialState.fee.gas;
      payment.fee.platform = initialState.fee.platform;
    },
    setPaymentState: (payment, action: PayloadAction<PaymentState>) => {
      Object.assign(payment, action.payload);
    },
    resetPaymentState: () => {
      return initialState;
    },
  },
});

export const {
  showPayment,
  hidePayment,
  setPaymentMode,
  setPaymentStatus,
  resetPaymentStatus,
  setPaymentActionType,
  setPaymentAction,
  resetPaymentAction,
  setPaymentFee,
  resetPaymentFee,
  setPaymentState,
  resetPaymentState,
} = paymentSlice.actions;
export default paymentSlice.reducer;

export const selectPaymentState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment,
);

export const selectPaymentShowState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.show,
);

export const selectPaymentStatus = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.status,
);

export const selectPaymentMode = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.mode,
);

export const selectPaymentAction = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.action,
);

export const selectPaymentActionPayload = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.action.payload,
);

export const selectPaymentFee = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.fee,
);

export const isPaymentUndefined = createSelector(
  (state: RootState) => state.payment,
  (payment: PaymentState) => !payment.action.loaded && !payment.fee.loaded,
);
