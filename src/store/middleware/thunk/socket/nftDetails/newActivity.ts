import { AppThunk } from 'enevti-app/store/state';
import { addNFTDetailsViewActivity } from 'enevti-app/store/slices/ui/view/nftDetails';

export const reduceNewNFTActivity =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(addNFTDetailsViewActivity({ key, value: payload }));
  };
