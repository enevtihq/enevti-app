import { AppThunk } from 'enevti-app/store/state';
import { setCollectionViewFetchedVersion } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewCollectionUpdates =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setCollectionViewFetchedVersion({ key, value: payload }));
  };
