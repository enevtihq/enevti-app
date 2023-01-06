import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const cacheVersionSlice = createSlice({
  name: 'cacheVersion',
  initialState: '0',
  reducers: {
    setCacheVersion: (cacheVersion, action: PayloadAction<string>) => {
      cacheVersion = action.payload;
    },
  },
});

export const { setCacheVersion } = cacheVersionSlice.actions;
export default cacheVersionSlice.reducer;

export const selectCacheVersion = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.version,
);
