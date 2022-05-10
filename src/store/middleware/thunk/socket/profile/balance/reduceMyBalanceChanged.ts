import { AppThunk } from 'enevti-app/store/state';
import { setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import {
  selectMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';

export const reduceMyBalanceChanged =
  (payload: any): AppThunk =>
  (dispatch, getState) => {
    const myProfileCache = selectMyProfileCache(getState());
    const newMyProfileCache = Object.assign({}, myProfileCache, { balance: payload });
    dispatch(setMyProfileCache(newMyProfileCache));
    dispatch(setMyProfileView({ balance: payload }));
  };
