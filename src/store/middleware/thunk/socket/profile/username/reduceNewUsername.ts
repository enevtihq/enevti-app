import { AppThunk } from 'enevti-app/store/state';
import {
  selectMyPersonaCache,
  setMyPersonaCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewUsername =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    if (myPersonaCache.address === action.target) {
      const newMyPersonaCache = Object.assign(myPersonaCache, { username: action.payload });
      dispatch(setMyPersonaCache(newMyPersonaCache));
      dispatch(setMyProfileView({ persona: newMyPersonaCache }));
    } else {
      if (key) {
        const profileView = selectProfileView(getState(), key);
        const newProfileView = Object.assign(profileView, {
          persona: Object.assign(profileView.persona, { username: action.payload }),
        });
        dispatch(setProfileView({ key, value: newProfileView }));
      }
    }
  };
