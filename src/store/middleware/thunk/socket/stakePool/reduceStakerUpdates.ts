import { AppThunk } from 'enevti-app/store/state';
import { setStakePoolFetchedVersion } from 'enevti-app/store/slices/ui/view/stakePool';

export const reduceStakerUpdates =
  (action: { type: string; target: string; payload: any }, key: string): AppThunk =>
  dispatch => {
    dispatch(setStakePoolFetchedVersion({ key, value: action.payload }));
  };
