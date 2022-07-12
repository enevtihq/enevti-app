import { AppThunk } from 'enevti-app/store/state';
import { setCollectionViewLike } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewCollectionLike =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setCollectionViewLike({ key, value: payload }));
  };
