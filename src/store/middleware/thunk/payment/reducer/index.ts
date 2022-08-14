import { AppThunk } from 'enevti-app/store/state';
import { reducePayCreateNFTOneKind } from './reducePayCreateNFTOneKind';
import { reducePayMintCollection } from './reducePayMintCollection';
import { reducePayAddStake } from './reducePayAddStake';
import { reducePayRegisterUsername } from './reducePayRegisterUsername';
import { reducePayDeliverSecret } from './reducePayDeliverSecret';
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { reducePayMintCollectionByQR } from './reducePayMintCollectionByQR';
import { reduceTransferToken } from './reduceTransferToken';
import { reducePayCommentCollection } from './reducePayCommentCollection';
import { reducePayCommentNFT } from './reducePayCommentNFT';
import { reducePayReplyComment } from './reducePayReplyComment';

export const reducePayment = (): AppThunk => (dispatch, getState) => {
  const paymentType = getState().payment.action.type;
  switch (paymentType) {
    case 'createNFTOneKind':
      dispatch(reducePayCreateNFTOneKind());
      break;
    case 'mintCollection':
      dispatch(reducePayMintCollection());
      break;
    case 'mintCollectionByQR':
      dispatch(reducePayMintCollectionByQR());
      break;
    case 'addStake':
      dispatch(reducePayAddStake());
      break;
    case 'registerUsername':
      dispatch(reducePayRegisterUsername());
      break;
    case 'deliverSecret':
      dispatch(reducePayDeliverSecret());
      break;
    case 'transferToken':
      dispatch(reduceTransferToken());
      break;
    case 'commentCollection':
      dispatch(reducePayCommentCollection());
      break;
    case 'commentNFT':
      dispatch(reducePayCommentNFT());
      break;
    case 'replyComment':
      dispatch(reducePayReplyComment());
      break;
    default:
      handleError({ message: i18n.t('error:unknownPayment') });
      break;
  }
};
