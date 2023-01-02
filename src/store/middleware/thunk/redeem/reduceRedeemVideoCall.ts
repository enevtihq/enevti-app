import { AppThunk } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { AppNavigationType } from 'enevti-app/utils/hook/useDebouncedNavigation';

export const reduceRedeemVideoCall =
  (nft: NFT, _navigation: AppNavigationType, _route: Record<string, any>): AppThunk =>
  async () => {
    _navigation('RedeemVideoCall', { nftId: nft.id });
  };
