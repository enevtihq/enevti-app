import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { PaymentAction, PaymentFee, PaymentState, PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { RootState } from 'enevti-app/store/state';

const initialState: PaymentState = {
  show: false,
  mode: 'full',
  status: {
    type: 'idle',
    action: '',
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
    meta: '',
  },
  fee: {
    loaded: false,
    gas: '0',
    platform: '0',
    base: '0',
    priority: 'custom',
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
      payment.status.action = action.payload.action;
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
      Object.assign(payment.action, action.payload);
      payment.action.loaded = true;
    },
    resetPaymentAction: payment => {
      Object.assign(payment.action, initialState.action);
    },
    setPaymentFee: (payment, action: PayloadAction<Omit<PaymentFee, 'loaded' | 'priority'>>) => {
      payment.fee.loaded = true;
      payment.fee.gas = action.payload.gas;
      payment.fee.platform = action.payload.platform;
      payment.fee.base = action.payload.base;
    },
    setPaymentFeeLoaded: (payment, action: PayloadAction<boolean>) => {
      payment.fee.loaded = action.payload;
    },
    setPaymentPriority: (payment, action: PayloadAction<PaymentFee['priority']>) => {
      payment.fee.priority = action.payload;
    },
    resetPaymentFee: payment => {
      payment.fee.loaded = false;
      payment.fee.gas = initialState.fee.gas;
      payment.fee.platform = initialState.fee.platform;
      payment.fee.base = initialState.fee.base;
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
  setPaymentFeeLoaded,
  setPaymentPriority,
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

export const selectPaymentActionMeta = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.action.meta,
);

export const selectPaymentFee = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.fee,
);

export const selectPaymentFeePriority = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.payment.fee.priority,
);

export const isPaymentUndefined = createSelector(
  (state: RootState) => state.payment,
  (payment: PaymentState) => !payment.action.loaded && !payment.fee.loaded,
);
