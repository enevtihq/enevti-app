import { AppThunk } from 'enevti-app/store/state';
import { addCollectionViewActivity } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewCollectionActivity =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(addCollectionViewActivity({ key, value: payload }));
  };
