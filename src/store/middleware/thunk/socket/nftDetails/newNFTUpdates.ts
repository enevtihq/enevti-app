import { AppThunk } from 'enevti-app/store/state';
import { setNFTDetailsFetchedVersion } from 'enevti-app/store/slices/ui/view/nftDetails';

export const reduceNewNFTUpdates =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(setNFTDetailsFetchedVersion({ key, value: payload }));
  };
