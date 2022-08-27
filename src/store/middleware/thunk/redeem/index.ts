import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import { reduceRedeemContent } from './reduceRedeemContent';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import i18n from 'enevti-app/translations/i18n';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { reduceRedeemVideoCall } from './reduceRedeemVideoCall';

export const reduceRedeem =
  (nft: NFT, navigation: StackNavigationProp<RootStackParamList>, route: Record<string, any>): AppThunk =>
  async dispatch => {
    try {
      const myAddress = await getMyAddress();
      if (nft.owner.address !== myAddress) {
        throw Error(i18n.t('error:notOwner'));
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
