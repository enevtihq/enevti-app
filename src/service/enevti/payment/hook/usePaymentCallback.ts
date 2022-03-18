import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearPaymentState,
  selectPaymentStatus,
} from '../../../../store/slices/payment';

interface PaymentCallbackHookProps {
  onIdle?: () => void;
  onInitiated?: () => void;
  onProcess?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function usePaymentCallback({
  onIdle,
  onInitiated,
  onProcess,
  onSuccess,
  onError,
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
        onSuccess && onSuccess();
        dispatch(clearPaymentState);
        break;
      case 'error':
        onError && onError();
        dispatch(clearPaymentState);
        break;
      default:
        break;
    }
  }, [
    paymentStatus,
    dispatch,
    onIdle,
    onInitiated,
    onProcess,
    onSuccess,
    onError,
  ]);
}
