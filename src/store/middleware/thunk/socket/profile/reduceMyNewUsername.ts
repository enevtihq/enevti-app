import { AppThunk } from 'enevti-app/store/state';
import {
  selectMyPersonaCache,
  setMyPersonaCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';

export const reduceMyNewUsername =
  (payload: string): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    const newMyPersonaCache = Object.assign(myPersonaCache, { username: payload });
    dispatch(setMyPersonaCache(newMyPersonaCache));
    dispatch(setMyProfileView({ persona: newMyPersonaCache }));
  };
