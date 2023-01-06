import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetFeedCache } from 'enevti-app/store/slices/entities/cache/feed';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import DeviceInfo from 'react-native-device-info';
import { selectCacheVersion, setCacheVersion } from 'enevti-app/store/slices/entities/cache/version';
import semver from 'semver';

export const clearCacheIfNewVersion = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'cache/clearCacheIfNewVersion',
  async (_, { dispatch, getState }) => {
    const currentVersion = DeviceInfo.getVersion();
    const cacheVersion = selectCacheVersion(getState());
    if (semver.gt(currentVersion, cacheVersion)) {
      dispatch(setCacheVersion(currentVersion));
      dispatch(resetFeedCache());
      dispatch(resetMyProfileCache());
    }
  },
);
