import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';

type FeedCacheState = { reqVersion: number; checkpoint: number; lastFetch: number; items: Feeds };

const initialState: FeedCacheState = { reqVersion: 0, checkpoint: 0, lastFetch: 0, items: [] };

const feedCacheSlice = createSlice({
  name: 'feedCache',
  initialState,
  reducers: {
    setFeedCacheState: (feed, action: PayloadAction<Partial<FeedCacheState>>) => {
      Object.assign(feed, action.payload);
    },
    setFeedItemsCache: (feed, action: PayloadAction<Feeds>) => {
      feed.items = action.payload.slice();
    },
    addFeedItemsCacheLike: (feed, action: PayloadAction<{ index: number }>) => {
      feed.items[action.payload.index].liked = true;
      feed.items[action.payload.index].like++;
    },
    setLastFetchFeedCache: (feed, action: PayloadAction<number>) => {
      feed.lastFetch = action.payload;
    },
    setFeedCacheCheckpoint: (feed, action: PayloadAction<number>) => {
      feed.checkpoint = action.payload;
    },
    setFeedCacheReqVersion: (feed, action: PayloadAction<number>) => {
      feed.reqVersion = action.payload;
    },
    resetFeedCache: () => {
      return initialState;
    },
  },
});

export const {
  setFeedCacheState,
  setFeedItemsCache,
  addFeedItemsCacheLike,
  setLastFetchFeedCache,
  setFeedCacheCheckpoint,
  setFeedCacheReqVersion,
  resetFeedCache,
} = feedCacheSlice.actions;
export default feedCacheSlice.reducer;

export const selectFeedItemsCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.items,
);

export const selectLastFetchFeedCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.lastFetch,
);

export const selectCheckpointFeedItemsCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.checkpoint,
);

export const selectReqVersionFeedItemsCache = createSelector(
  (state: RootState) => state.entities.cache.feed,
  (feed: FeedCacheState) => feed.reqVersion,
);
