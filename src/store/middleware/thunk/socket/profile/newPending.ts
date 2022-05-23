import { AppThunk } from 'enevti-app/store/state';
import { setMyProfileViewPending, selectMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { setProfileViewPending } from 'enevti-app/store/slices/ui/view/profile';
import { setMyProfileCachePending } from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceNewPending =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setProfileViewPending({ key, value: payload }));
  };

export const reduceMyNewPending =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    dispatch(setMyProfileCachePending(payload));
    const profileView = selectMyProfileView(getState());
    if (profileView.pending !== -1) {
      dispatch(setMyProfileViewPending(payload));
    }
  };
