import { AppThunk } from 'enevti-app/store/state';
import { addMyProfileViewOwnedNFT } from 'enevti-app/store/slices/ui/view/myProfile';
import { addMyProfileCacheOwnedNFT } from 'enevti-app/store/slices/entities/cache/myProfile';
import { addProfileViewOwnedNFT } from 'enevti-app/store/slices/ui/view/profile';

export const reduceNewOwned =
  (payload: any, key: string): AppThunk =>
  dispatch => {
    dispatch(addProfileViewOwnedNFT({ key, value: payload }));
  };

export const reduceMyNewOwned =
  (payload: any): AppThunk =>
  dispatch => {
    dispatch(addMyProfileCacheOwnedNFT(payload));
    dispatch(addMyProfileViewOwnedNFT(payload));
  };
