import { AppThunk } from 'enevti-app/store/state';
import { unshiftCollectionViewActivity } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewCollectionActivity =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(unshiftCollectionViewActivity({ key, value: payload }));
  };
