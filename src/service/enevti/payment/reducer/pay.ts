import {
  selectPaymentAction,
  selectPaymentItem,
  setPaymentStatus,
} from '../../../../store/slices/payment';
import { store } from '../../../../store/state';

export default async function reducePayment() {
  store.dispatch(setPaymentStatus({ type: 'process', message: '' }));
  const paymentItem = selectPaymentItem(store.getState());
  const paymentAction = selectPaymentAction(store.getState());
  console.log(paymentAction, paymentItem);
  setTimeout(() => null, 5000);
  store.dispatch(setPaymentStatus({ type: 'success', message: '' }));
}
