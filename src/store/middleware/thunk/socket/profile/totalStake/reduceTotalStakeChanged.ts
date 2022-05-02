import { AppThunk } from 'enevti-app/store/state';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';
import {
  selectMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceTotalStakeChanged =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    if (myPersonaCache.address === action.target) {
      const myProfileCache = selectMyProfileCache(getState());
      const newMyProfileCache = Object.assign(myProfileCache, {
        stake: action.payload,
      });
      dispatch(setMyProfileCache(newMyProfileCache));
      dispatch(
        setMyProfileView({
          stake: action.payload,
        }),
      );
    } else {
      if (key) {
        const profileView = selectProfileView(getState(), key);
        const newProfileView = Object.assign(profileView, {
          stake: action.payload,
        });
        dispatch(setProfileView({ key, value: newProfileView }));
      }
    }
  };
