import { AppThunk } from '../../../state';
import { reducePayCreateNFTOneKind } from './reducePayCreateNFTOneKind';
import { reducePayMintCollection } from './reducePayMintCollection';
import { handleError } from '../../../../utils/error/handle';
import { showSnackbar } from '../../../slices/ui/global/snackbar';

export const reducePayment = (): AppThunk => (dispatch, getState) => {
  const paymentType = getState().payment.action.type;
  switch (paymentType) {
    case 'createNFTOneKind':
      dispatch(reducePayCreateNFTOneKind());
      break;
    case 'mintCollection':
      dispatch(reducePayMintCollection());
      break;
    case 'cancel':
      dispatch(
        showSnackbar({ mode: 'info', text: getState().payment.status.message }),
      );
      break;
    default:
      handleError({ message: 'unknown payment type' });
      break;
  }
};
