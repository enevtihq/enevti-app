import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { hidePayment, setPaymentStatus } from 'enevti-app/store/slices/payment';
import { PAYMENT_ERROR_DELAY_TIME } from 'enevti-app/utils/constant/payment';
import sleep from 'enevti-app/utils/dummy/sleep';
import { handleError } from 'enevti-app/utils/error/handle';
import { PaymentAction } from 'enevti-app/types/ui/store/Payment';

type OnPaymentCreatorErrorProps = {
  dispatch: Dispatch<AnyAction>;
  err: any;
  id: string;
  key: string;
  action: PaymentAction['type'];
};

export default async function onPaymentCreatorError({ dispatch, err, id, key, action }: OnPaymentCreatorErrorProps) {
  await sleep(PAYMENT_ERROR_DELAY_TIME);
  handleError(err);
  dispatch(hidePayment());
  dispatch(
    setPaymentStatus({
      id,
      key,
      action,
      type: 'error',
      message: (err as Record<string, any>).message.toString(),
    }),
  );
}
