import { AppThunk } from 'enevti-app/store/state';
import { unshiftCollectionViewMinted } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewNFTMinted =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(unshiftCollectionViewMinted({ key, value: payload }));
  };
