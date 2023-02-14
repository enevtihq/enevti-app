import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-types/service/feed';

type MomentsCacheState = { items: Moments };

const initialState: MomentsCacheState = { items: [] };

const momentCacheSlice = createSlice({
  name: 'momentCache',
  initialState,
  reducers: {
    setMomentItemsCache: (moment, action: PayloadAction<Moments>) => {
      moment.items = action.payload.slice();
    },
    resetMomentCache: () => {
      return initialState;
    },
  },
});

export const { setMomentItemsCache, resetMomentCache } = momentCacheSlice.actions;
export default momentCacheSlice.reducer;

export const selectMomentItemsCache = createSelector(
  (state: RootState) => state.entities.cache.moment,
  (moment: MomentsCacheState) => moment.items,
);
