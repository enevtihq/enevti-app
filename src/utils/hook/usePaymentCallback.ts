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
  condition?: (action?: PaymentStatus['action'], id?: any) => boolean;
  onIdle?: (action?: PaymentStatus['action']) => void;
  onInitiated?: (action?: PaymentStatus['action']) => void;
  onProcess?: (action?: PaymentStatus['action']) => void;
  onSuccess?: (action?: PaymentStatus['action']) => void;
  onError?: (action?: PaymentStatus['action']) => void;
  onCancel?: (action?: PaymentStatus['action']) => void;
}

export default function usePaymentCallback({
  condition,
  onIdle,
  onInitiated,
  onProcess,
  onSuccess,
  onError,
  onCancel,
}: PaymentCallbackHookProps) {
  const dispatch = useDispatch();
  const paymentStatus = useSelector(selectPaymentStatus);
  React.useEffect(() => {
    if (condition !== undefined && !condition(paymentStatus.action, paymentStatus.id)) {
      return;
    }
    switch (paymentStatus.type) {
      case 'idle':
        onIdle && onIdle(paymentStatus.action);
        dispatch(resetPaymentStatus());
        break;
      case 'initiated':
        onInitiated && onInitiated(paymentStatus.action);
        break;
      case 'process':
        onProcess && onProcess(paymentStatus.action);
        break;
      case 'success':
        onSuccess && onSuccess(paymentStatus.action);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      case 'error':
        onError && onError(paymentStatus.action);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      case 'cancel':
        onCancel && onCancel(paymentStatus.action);
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        break;
      default:
        break;
    }
  }, [paymentStatus, dispatch, condition, onIdle, onInitiated, onProcess, onSuccess, onError, onCancel]);
}
