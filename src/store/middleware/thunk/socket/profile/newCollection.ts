import { AppThunk } from 'enevti-app/store/state';
import { unshiftMyProfileViewCollection } from 'enevti-app/store/slices/ui/view/myProfile';
import { unshiftMyProfileCacheCollection } from 'enevti-app/store/slices/entities/cache/myProfile';
import { unshiftProfileViewCollection } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewCollection =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(unshiftProfileViewCollection({ key, value: payload }));
  };

export const reduceMyNewCollection =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(unshiftMyProfileCacheCollection(payload));
    dispatch(unshiftMyProfileViewCollection(payload));
  };
