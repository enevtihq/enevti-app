import { AppThunk } from 'enevti-app/store/state';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';
import {
  selectMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceTotalStakeMinus =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    if (myPersonaCache.address === action.target) {
      const myProfileCache = selectMyProfileCache(getState());
      const newStake = (BigInt(myProfileCache.stake) - BigInt(action.payload)).toString();
      const newMyProfileCache = Object.assign(myProfileCache, {
        stake: newStake,
      });
      dispatch(setMyProfileCache(newMyProfileCache));
      dispatch(
        setMyProfileView({
          stake: newStake,
        }),
      );
    } else {
      if (key) {
        const profileView = selectProfileView(getState(), key);
        const newProfileView = Object.assign(profileView, {
          stake: (BigInt(profileView.stake) - BigInt(action.payload)).toString(),
        });
        dispatch(setProfileView({ key, value: newProfileView }));
      }
    }
  };
