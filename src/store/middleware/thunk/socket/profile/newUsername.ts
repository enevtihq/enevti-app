import { AppThunk } from 'enevti-app/store/state';
import { selectMyPersonaCache, setMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectProfileView, setProfileView } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewUsername =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const profileView = selectProfileView(getState(), key);
    const newProfileView = Object.assign({}, profileView, {
      persona: Object.assign({}, profileView.persona, { username: payload }),
    });
    dispatch(setProfileView({ key, value: newProfileView }));
  };

export const reduceMyNewUsername =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    const newMyPersonaCache = Object.assign({}, myPersonaCache, { username: payload });
    dispatch(setMyPersonaCache(newMyPersonaCache));
    dispatch(setMyProfileView({ persona: newMyPersonaCache }));
  };
