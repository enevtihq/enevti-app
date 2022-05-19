import { AppThunk } from 'enevti-app/store/state';
import { setNFTDetailsViewSecret } from 'enevti-app/store/slices/ui/view/nftDetails';

export const redudeNFTSecretDelivered =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setNFTDetailsViewSecret({ key, value: payload }));
  };
