import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';

type FeedCacheState = { lastFetch: number; items: Feeds };

const initialState: FeedCacheState = { lastFetch: 0, items: [] };

const feedCacheSlice = createSlice({
  name: 'feedCache',
  initialState,
  reducers: {
    setFeedItemsCache: (feed, action: PayloadAction<Feeds>) => {
      feed.items = action.payload.slice();
    },
    setLastFetchFeedCache: (feed, action: PayloadAction<number>) => {
      feed.lastFetch = action.payload;
    },
    resetFeedCache: () => {
      return initialState;
    },
  },
});

export const { setFeedItemsCache, setLastFetchFeedCache, resetFeedCache } = feedCacheSlice.actions;
export default feedCacheSlice.reducer;

export const selectFeedItemsCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.items,
);

export const selectLastFetchFeedCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.lastFetch,
);
