import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { AppThunk } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/core/chain/nft';

export const reduceRedeemVideoCall =
  (nft: NFT, _navigation: StackNavigationProp<RootStackParamList>, _route: Record<string, any>): AppThunk =>
  async () => {
    _navigation.push('RedeemVideoCall', { nftId: nft.id });
  };
