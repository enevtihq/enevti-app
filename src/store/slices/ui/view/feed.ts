import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { assignDeep } from 'enevti-app/utils/primitive/object';

type FeedViewState = {
  checkpoint: number;
  buyDisabled: boolean;
  version: number;
  fetchedVersion: number;
  loaded: boolean;
  reqStatus: number;
  reqVersion: number;
  items: Feeds;
};

const initialState: FeedViewState = {
  checkpoint: 0,
  buyDisabled: false,
  version: 0,
  fetchedVersion: 0,
  loaded: false,
  reqStatus: 0,
  reqVersion: 0,
  items: [],
};

const feedViewSlice = createSlice({
  name: 'feedView',
  initialState,
  reducers: {
    setFeedViewState: (feed, action: PayloadAction<Partial<FeedViewState>>) => {
      assignDeep(feed, action.payload);
    },
    setFeedViewBuyDisabled: (feed, action: PayloadAction<boolean>) => {
      feed.buyDisabled = action.payload;
    },
    setFeedView: (feed, action: PayloadAction<Feeds>) => {
      feed.items = action.payload.slice();
    },
    addFeedViewLike: (feed, action: PayloadAction<{ index: number }>) => {
      feed.items[action.payload.index].liked = true;
      feed.items[action.payload.index].like++;
    },
    addFeedView: (feed, action: PayloadAction<{ feed: Feeds; reqVersion: number; checkpoint: number }>) => {
      feed.items.concat(action.payload.feed);
      feed.checkpoint = action.payload.checkpoint;
      feed.reqVersion = action.payload.reqVersion;
    },
    setFeedViewCheckpoint: (feed, action: PayloadAction<number>) => {
      feed.checkpoint = action.payload;
    },
    setFeedViewVersion: (feed, action: PayloadAction<number>) => {
      feed.version = action.payload;
    },
    setFeedViewFetchedVersion: (feed, action: PayloadAction<number>) => {
      feed.fetchedVersion = action.payload;
    },
    setFeedViewLoaded: (feed, action: PayloadAction<boolean>) => {
      feed.loaded = action.payload;
    },
    setFeedViewReqStatus: (feed, action: PayloadAction<number>) => {
      feed.reqStatus = action.payload;
    },
    setFeedViewReqVersion: (feed, action: PayloadAction<number>) => {
      feed.reqVersion = action.payload;
    },
    resetFeedView: () => {
      return initialState;
    },
  },
});

export const {
  setFeedViewState,
  setFeedViewBuyDisabled,
  setFeedView,
  addFeedViewLike,
  addFeedView,
  setFeedViewCheckpoint,
  setFeedViewVersion,
  setFeedViewFetchedVersion,
  setFeedViewLoaded,
  setFeedViewReqStatus,
  setFeedViewReqVersion,
  resetFeedView,
} = feedViewSlice.actions;
export default feedViewSlice.reducer;

export const selectFeedView = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.items,
);

export const selectFeedViewCheckpoint = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.checkpoint,
);

export const selectFeedViewReqVersion = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.reqVersion,
);

export const selectFeedViewReqStatus = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.reqStatus,
);

export const isFeedUndefined = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => !feed.loaded,
);

export const isThereAnyNewFeedView = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.fetchedVersion > feed.version,
);

export const isFeedBuyDisabled = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.buyDisabled,
);
