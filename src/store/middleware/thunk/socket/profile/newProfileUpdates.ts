import { AppThunk } from 'enevti-app/store/state';
import { setProfileViewFetchedVersion } from 'enevti-app/store/slices/ui/view/profile';
import { setMyProfileViewFetchedVersion } from 'enevti-app/store/slices/ui/view/myProfile';

export const reduceNewProfileUpdates =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setProfileViewFetchedVersion({ key, value: payload }));
  };

export const reduceMyNewProfileUpdates =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(setMyProfileViewFetchedVersion(payload));
  };
