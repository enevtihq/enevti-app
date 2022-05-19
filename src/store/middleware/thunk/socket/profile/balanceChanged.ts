import { AppThunk } from 'enevti-app/store/state';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectMyProfileCache, setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceBalanceChanged =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const profileView = selectProfileView(getState(), key);
    const newProfileView = Object.assign({}, profileView, { balance: payload });
    dispatch(setProfileView({ key, value: newProfileView }));
  };

export const reduceMyBalanceChanged =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myProfileCache = selectMyProfileCache(getState());
    const newMyProfileCache = Object.assign({}, myProfileCache, { balance: payload });
    dispatch(setMyProfileCache(newMyProfileCache));
    dispatch(setMyProfileView({ balance: payload }));
  };
