import { AppThunk } from 'enevti-app/store/state';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';
import {
  selectMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceBalancePlus =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    if (myPersonaCache.address === action.target) {
      const myProfileCache = selectMyProfileCache(getState());
      const newBalance = (BigInt(myProfileCache.balance) + BigInt(action.payload)).toString();
      const newMyProfileCache = Object.assign(myProfileCache, {
        balance: newBalance,
      });
      dispatch(setMyProfileCache(newMyProfileCache));
      dispatch(
        setMyProfileView({
          balance: newBalance,
        }),
      );
    } else {
      if (key) {
        const profileView = selectProfileView(getState(), key);
        const newProfileView = Object.assign(profileView, {
          balance: (BigInt(profileView.balance) + BigInt(action.payload)).toString(),
        });
        dispatch(setProfileView({ key, value: newProfileView }));
      }
    }
  };
