import { setWalletViewFetchedVersion } from 'enevti-app/store/slices/ui/view/wallet';
import { AppThunk } from 'enevti-app/store/state';

export const reduceNewWalletUpdates =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setWalletViewFetchedVersion({ key, value: payload }));
  };
