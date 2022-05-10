import { AppThunk } from 'enevti-app/store/state';
import { setFeedViewFetchedVersion } from 'enevti-app/store/slices/ui/view/feed';

export const reduceFeedsUpdates =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(setFeedViewFetchedVersion(payload));
  };
