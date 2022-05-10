import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-app/types/core/service/feed';

type MomentsCacheState = { lastFetch: number; items: Moments };

const initialState: MomentsCacheState = { lastFetch: 0, items: [] };

const momentCacheSlice = createSlice({
  name: 'momentCache',
  initialState,
  reducers: {
    setMomentItemsCache: (moment, action: PayloadAction<Moments>) => {
      moment.items = action.payload.slice();
    },
    setLastFetchMomentCache: (moment, action: PayloadAction<number>) => {
      moment.lastFetch = action.payload;
    },
    resetMomentCache: () => {
      return initialState;
    },
  },
});

export const { setMomentItemsCache, setLastFetchMomentCache, resetMomentCache } = momentCacheSlice.actions;
export default momentCacheSlice.reducer;

export const selectMomentItemsCache = createSelector(
  (state: RootState) => state.entities.cache.moment,
  (moment: MomentsCacheState) => moment.items,
);

export const selectLastFetchMomentCache = createSelector(
  (state: RootState) => state.entities.cache.moment,
  (moment: MomentsCacheState) => moment.lastFetch,
);
