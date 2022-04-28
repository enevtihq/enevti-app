import { AppThunk } from 'enevti-app/store/state';
import { reducePayCreateNFTOneKind } from './reducePayCreateNFTOneKind';
import { reducePayMintCollection } from './reducePayMintCollection';
import { reducePayAddStake } from './reducePayAddStake';
import { reducePayRegisterUsername } from './reducePayRegisterUsername';
import { handleError } from 'enevti-app/utils/error/handle';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import i18n from 'enevti-app/translations/i18n';

export const reducePayment = (): AppThunk => (dispatch, getState) => {
  const paymentType = getState().payment.action.type;
  switch (paymentType) {
    case 'createNFTOneKind':
      dispatch(reducePayCreateNFTOneKind());
      break;
    case 'mintCollection':
      dispatch(reducePayMintCollection());
      break;
    case 'addStake':
      dispatch(reducePayAddStake());
      break;
    case 'registerUsername':
      dispatch(reducePayRegisterUsername());
      break;
    case 'cancel':
      dispatch(showSnackbar({ mode: 'info', text: getState().payment.status.message }));
      break;
    default:
      handleError({ message: i18n.t('error:unknownPayment') });
      break;
  }
};
