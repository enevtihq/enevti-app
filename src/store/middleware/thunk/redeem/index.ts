import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import { NFT } from 'enevti-app/types/nft';
import { reduceRedeemContent } from './reduceRedeemContent';

export const reduceRedeem =
  (nft: NFT): AppThunk =>
  dispatch => {
    const utility = nft.utility;
    switch (utility) {
      case 'content':
        dispatch(reduceRedeemContent(nft));
        break;
      default:
        handleError({ message: 'unknown utility type' });
        break;
    }
  };
