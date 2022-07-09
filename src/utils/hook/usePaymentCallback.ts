import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPaymentState, selectPaymentStatus } from 'enevti-app/store/slices/payment';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';

interface PaymentCallbackHookProps {
  onIdle?: (action?: PaymentStatus['action']) => void;
  onInitiated?: (action?: PaymentStatus['action']) => void;
  onProcess?: (action?: PaymentStatus['action']) => void;
  onSuccess?: (action?: PaymentStatus['action']) => void;
  onError?: (action?: PaymentStatus['action']) => void;
  onCancel?: (action?: PaymentStatus['action']) => void;
}

export default function usePaymentCallback({
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
    switch (paymentStatus.type) {
      case 'idle':
        onIdle && onIdle(paymentStatus.action);
        break;
      case 'initiated':
        onInitiated && onInitiated(paymentStatus.action);
        break;
      case 'process':
        onProcess && onProcess(paymentStatus.action);
        break;
      case 'success':
        dispatch(resetPaymentState());
        onSuccess && onSuccess(paymentStatus.action);
        break;
      case 'error':
        dispatch(resetPaymentState());
        onError && onError(paymentStatus.action);
        break;
      case 'cancel':
        dispatch(resetPaymentState());
        onCancel && onCancel(paymentStatus.action);
        break;
      default:
        break;
    }
  }, [paymentStatus, dispatch, onIdle, onInitiated, onProcess, onSuccess, onError, onCancel]);
}
