import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import { reduceRedeemContent } from './reduceRedeemContent';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import i18n from 'enevti-app/translations/i18n';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { reduceRedeemVideoCall } from './reduceRedeemVideoCall';
import { AppNavigationType } from 'enevti-app/utils/hook/useDebouncedNavigation';

export const reduceRedeem =
  (nft: NFT, navigation: AppNavigationType, route: Record<string, any>): AppThunk =>
  async dispatch => {
    try {
      const myAddress = await getMyAddress();
      if (nft.utility === 'videocall') {
        if (![nft.owner.address, nft.creator.address].includes(myAddress)) {
          throw Error(i18n.t('error:notOwnerOrCreator'));
        }
      } else {
        if (nft.owner.address !== myAddress) {
          throw Error(i18n.t('error:notOwner'));
        }
      }
      const utility = nft.utility;
      switch (utility) {
        case 'content':
          dispatch(reduceRedeemContent(nft));
          break;
        case 'videocall':
          dispatch(reduceRedeemVideoCall(nft, navigation, route));
          break;
        default:
          handleError({ message: i18n.t('error:unknownUtility') });
          break;
      }
    } catch (err: any) {
      handleError(err);
    }
  };
