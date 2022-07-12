import { AppThunk } from 'enevti-app/store/state';
import { setNFTDetailsViewLike } from 'enevti-app/store/slices/ui/view/nftDetails';

export const reduceNewNFTLike =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setNFTDetailsViewLike({ key, value: payload }));
  };
