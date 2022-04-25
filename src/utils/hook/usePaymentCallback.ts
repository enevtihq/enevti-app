import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPaymentState, selectPaymentStatus } from 'enevti-app/store/slices/payment';

interface PaymentCallbackHookProps {
  onIdle?: () => void;
  onInitiated?: () => void;
  onProcess?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
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
        onIdle && onIdle();
        break;
      case 'initiated':
        onInitiated && onInitiated();
        break;
      case 'process':
        onProcess && onProcess();
        break;
      case 'success':
        dispatch(resetPaymentState());
        onSuccess && onSuccess();
        break;
      case 'error':
        dispatch(resetPaymentState());
        onError && onError();
        break;
      case 'cancel':
        dispatch(resetPaymentState());
        onCancel && onCancel();
        break;
      default:
        break;
    }
  }, [paymentStatus, dispatch, onIdle, onInitiated, onProcess, onSuccess, onError, onCancel]);
}
