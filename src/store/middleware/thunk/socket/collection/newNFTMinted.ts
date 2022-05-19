import { AppThunk } from 'enevti-app/store/state';
import { addCollectionViewMinted } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewNFTMinted =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(addCollectionViewMinted({ key, value: payload }));
  };
