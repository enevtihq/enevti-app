import { COIN_NAME } from '../../../../components/atoms/brand/AppBrandConstant';
import { iconMap } from '../../../../components/atoms/icon/AppIconComponent';
import {
  addPaymentAction,
  addPaymentItem,
  setPaymentHeader,
  setPaymentStatus,
  showPayment,
} from '../../../../store/slices/payment';
import { store } from '../../../../store/state';
import { CreateNFTOneKind } from '../../../../types/store/CreateNFTQueue';
import calculateFee from '../utils/calculateFee';

export default async function createOneKindContractPayment(payload: string) {
  const dispatch = store.dispatch;
  const payloadObject = JSON.parse(payload) as CreateNFTOneKind;
  const transactionPayload = payload;
  const transactionFee = await calculateFee(transactionPayload);
  dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
  if (payloadObject.dataUri) {
    dispatch(
      addPaymentAction({
        type: 'ipfs',
        name: 'dataCID',
        title: 'Upload to IPFS',
        description: 'Upload NFT data image to IPFS',
        payload: payloadObject.dataUri,
      }),
    );
  }
  if (payloadObject.state.coverUri) {
    dispatch(
      addPaymentAction({
        type: 'ipfs',
        name: 'coverCID',
        title: 'Upload to IPFS',
        description: 'Upload cover image to IPFS',
        payload: payloadObject.state.coverUri,
      }),
    );
  }
  dispatch(
    addPaymentAction({
      type: 'createOneKind',
      name: 'createOneKind',
      title: 'Create One Kind Collection',
      description:
        'Submit Blockchain transaction to create One Kind NFT Collection',
      payload: transactionPayload,
    }),
  );
  dispatch(
    addPaymentItem({
      name: 'createOneKind',
      title: 'Gas Fee',
      description: 'Create One Kind NFT blockchain transaction fee',
      amount: transactionFee,
      currency: COIN_NAME,
    }),
  );
  dispatch(
    setPaymentHeader({
      icon: iconMap.dollar,
      name: 'Create NFT',
      description: 'Create a One Kind NFT Collection',
    }),
  );
  dispatch(showPayment());
}
