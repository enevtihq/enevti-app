import { AppThunk } from 'enevti-app/store/state';
import { unshiftNFTDetailsViewActivity } from 'enevti-app/store/slices/ui/view/nftDetails';

export const reduceNewNFTActivity =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(unshiftNFTDetailsViewActivity({ key, value: payload }));
  };
