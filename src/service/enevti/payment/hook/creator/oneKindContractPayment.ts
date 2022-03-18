import { showPayment } from '../../../../../store/slices/payment';
import { store } from '../../../../../store/state';

export default async function createOneKindContractPayment(payload: string) {
  const dispatch = store.dispatch;
  // build payload => form value, ipfs data, ipfs cover => JSON.stringify
  // setup payment action
  // setup payment item
  // setup payment header
  // dispatch
  console.log(payload);
  dispatch(showPayment());
}
