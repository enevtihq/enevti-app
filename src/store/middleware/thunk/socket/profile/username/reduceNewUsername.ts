import { AppThunk } from 'enevti-app/store/state';
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
