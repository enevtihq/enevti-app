import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetPaymentState,
  resetPaymentStatus,
  resetPaymentStatusType,
  selectPaymentStatus,
} from 'enevti-app/store/slices/payment';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';

interface PaymentCallbackHookProps {
  condition: (paymentStatus: PaymentStatus) => boolean;
  onIdle?: (paymentStatus: PaymentStatus) => void;
  onInitiated?: (paymentStatus: PaymentStatus) => void;
  onProcess?: (paymentStatus: PaymentStatus) => void;
  onSuccess?: (paymentStatus: PaymentStatus) => void;
  onError?: (paymentStatus: PaymentStatus) => void;
  onCancel?: (paymentStatus: PaymentStatus) => void;
  onDismissed?: (paymentStatus: PaymentStatus) => void;
  onCleaned?: (paymentStatus: PaymentStatus) => void;
}

export default function usePaymentCallback({
  condition,
  onIdle,
  onInitiated,
  onProcess,
  onSuccess,
  onError,
  onCancel,
  onDismissed,
  onCleaned,
}: PaymentCallbackHookProps) {
  const dispatch = useDispatch();
  const lastPaymentType = React.useRef<string>('');
  const paymentStatus = useSelector(selectPaymentStatus);

  React.useEffect(() => {
    if (paymentStatus.type === lastPaymentType.current) {
      return;
    }
    lastPaymentType.current = paymentStatus.type;

    if (condition !== undefined && !condition(paymentStatus)) {
      return;
    }
    switch (paymentStatus.type) {
      case 'idle':
        onIdle && onIdle(paymentStatus);
        dispatch(resetPaymentStatus());
        break;
      case 'initiated':
        onInitiated && onInitiated(paymentStatus);
        break;
      case 'process':
        onProcess && onProcess(paymentStatus);
        break;
      case 'success':
        onSuccess && onSuccess(paymentStatus);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      case 'error':
        onError && onError(paymentStatus);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      case 'dismissed':
        onDismissed && onDismissed(paymentStatus);
        break;
      case 'cancel':
        onCancel && onCancel(paymentStatus);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      case 'cleaned':
        onCleaned && onCleaned(paymentStatus);
        break;
      default:
        break;
    }
  }, [
    paymentStatus,
    dispatch,
    condition,
    onIdle,
    onInitiated,
    onProcess,
    onSuccess,
    onError,
    onCancel,
    onDismissed,
    onCleaned,
  ]);
}
