import { AppThunk } from 'enevti-app/store/state';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { selectMyProfileCache, setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { parseProfileCache } from 'enevti-app/service/enevti/profile';

export const reduceMyNewCollection =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myProfileCache = selectMyProfileCache(getState());
    const newMyProfileCache = Object.assign({}, myProfileCache, { collection: payload.slice() });
    dispatch(setMyProfileCache(parseProfileCache(newMyProfileCache)));
    dispatch(setMyProfileView({ collection: payload.slice() }));
  };
