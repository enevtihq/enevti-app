import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type FCMTokenCache = { token: string };

const initialState: FCMTokenCache = {
  token: '',
};

const fcmTokenCacheSlice = createSlice({
  name: 'fcmTokenCache',
  initialState,
  reducers: {
    setFCMTokenCache: (fcm, action: PayloadAction<string>) => {
      fcm.token = action.payload;
    },
    resetFCMTokenCache: () => {
      return initialState;
    },
  },
});

export const { setFCMTokenCache, resetFCMTokenCache } = fcmTokenCacheSlice.actions;
export default fcmTokenCacheSlice.reducer;

export const selectFCMTokenCacheState = createSelector(
  (state: RootState) => state.entities.cache.fcm,
  (fcm: FCMTokenCache) => fcm.token,
);

export const isFCMTokenCacheReady = createSelector(
  (state: RootState) => state.entities.cache.fcm,
  (fcm: FCMTokenCache) => fcm.token !== '',
);
