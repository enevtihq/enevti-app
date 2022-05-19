import { AppThunk } from 'enevti-app/store/state';
import { addMyProfileViewCollection } from 'enevti-app/store/slices/ui/view/myProfile';
import { addMyProfileCacheCollection } from 'enevti-app/store/slices/entities/cache/myProfile';
import { addProfileViewCollection } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewCollection =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(addProfileViewCollection({ key, value: payload }));
  };

export const reduceMyNewCollection =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(addMyProfileCacheCollection(payload));
    dispatch(addMyProfileViewCollection(payload));
  };
