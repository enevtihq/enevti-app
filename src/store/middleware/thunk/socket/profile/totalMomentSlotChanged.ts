import { AppThunk } from 'enevti-app/store/state';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectMyProfileCache, setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceMyTotalMomentSlotChanged =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myProfileCache = selectMyProfileCache(getState());
    const newMyProfileCache = Object.assign({}, myProfileCache, { momentSlot: payload });
    dispatch(setMyProfileCache(newMyProfileCache));
    dispatch(setMyProfileView({ momentSlot: payload }));
  };

export const reduceTotalMomentSlotChanged =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const profileView = selectProfileView(getState(), key);
    const newProfileView = Object.assign({}, profileView, { momentSlot: payload });
    dispatch(setProfileView({ key, value: newProfileView }));
  };
