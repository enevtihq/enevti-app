import { AppThunk } from 'enevti-app/store/state';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectMyProfileCache, setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';

export const reduceTotalStakeChanged =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const profileView = selectProfileView(getState(), key);
    const newProfileView = Object.assign({}, profileView, { stake: payload });
    dispatch(setProfileView({ key, value: newProfileView }));
  };

export const reduceMyTotalStakeChanged =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myProfileCache = selectMyProfileCache(getState());
    const newMyProfileCache = Object.assign({}, myProfileCache, { stake: payload });
    dispatch(setMyProfileCache(newMyProfileCache));
    dispatch(setMyProfileView({ stake: payload }));
  };
