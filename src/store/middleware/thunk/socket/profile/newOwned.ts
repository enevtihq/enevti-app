import { AppThunk } from 'enevti-app/store/state';
import { unshiftMyProfileViewOwnedNFT } from 'enevti-app/store/slices/ui/view/myProfile';
import { unshiftMyProfileCacheOwnedNFT } from 'enevti-app/store/slices/entities/cache/myProfile';
import { unshiftProfileViewOwnedNFT } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewOwned =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(unshiftProfileViewOwnedNFT({ key, value: payload }));
  };

export const reduceMyNewOwned =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(unshiftMyProfileCacheOwnedNFT(payload));
    dispatch(unshiftMyProfileViewOwnedNFT(payload));
  };
