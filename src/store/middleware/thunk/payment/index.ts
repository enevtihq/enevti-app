import { AppThunk } from '../../../state';
import { reducePayCreateNFTOneKind } from './reducePayCreateNFTOneKind';
import { handleError } from '../../../../utils/error/handle';

export const reducePayment = (): AppThunk => (dispatch, getState) => {
  const paymentType = getState().payment.action.type;
  switch (paymentType) {
    case 'createNFTOneKind':
      dispatch(reducePayCreateNFTOneKind());
      break;
    default:
      handleError({ message: 'unknown payment type' });
      break;
  }
};
