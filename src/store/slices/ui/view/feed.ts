import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';

type FeedViewState = {
  checkpoint: number;
  version: number;
  fetchedVersion: number;
  loaded: boolean;
  reqStatus: number;
  reqVersion: number;
  items: Feeds;
};

const initialState: FeedViewState = {
  checkpoint: 0,
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
    setFeedView: (feed, action: PayloadAction<Feeds>) => {
      feed.items = action.payload.slice();
    },
    addFeedView: (feed, action: PayloadAction<Feeds>) => {
      feed.items.concat(action.payload);
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
  setFeedView,
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
