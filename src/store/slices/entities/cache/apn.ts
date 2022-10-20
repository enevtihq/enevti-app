import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type APNTokenCache = { token: string };

const initialState: APNTokenCache = {
  token: '',
};

const apnTokenCacheSlice = createSlice({
  name: 'apnTokenCache',
  initialState,
  reducers: {
    setAPNTokenCache: (apn, action: PayloadAction<string>) => {
      apn.token = action.payload;
    },
    resetAPNTokenCache: () => {
      return initialState;
    },
  },
});

export const { setAPNTokenCache, resetAPNTokenCache } = apnTokenCacheSlice.actions;
export default apnTokenCacheSlice.reducer;

export const selectAPNTokenCacheState = createSelector(
  (state: RootState) => state.entities.cache.apn,
  (apn: APNTokenCache) => apn.token,
);

export const isAPNTokenCacheReady = createSelector(
  (state: RootState) => state.entities.cache.apn,
  (apn: APNTokenCache) => apn.token !== '',
);
