import { AppThunk } from 'enevti-app/store/state';
import { setStakePoolFetchedVersion } from 'enevti-app/store/slices/ui/view/stakePool';

export const reduceStakerUpdates =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setStakePoolFetchedVersion({ key, value: payload }));
  };
