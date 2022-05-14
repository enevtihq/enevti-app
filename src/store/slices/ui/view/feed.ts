import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';

type FeedViewState = {
  offset: number;
  version: number;
  fetchedVersion: number;
  loaded: boolean;
  reqStatus: number;
  items: Feeds;
};

const initialState: FeedViewState = {
  offset: 0,
  version: 0,
  fetchedVersion: 0,
  loaded: false,
  reqStatus: 0,
  items: [],
};

const feedViewSlice = createSlice({
  name: 'feedView',
  initialState,
  reducers: {
    setFeedView: (feed, action: PayloadAction<Feeds>) => {
      feed.items = action.payload.slice();
    },
    setFeedViewOffset: (feed, action: PayloadAction<number>) => {
      feed.offset = action.payload;
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
    resetFeedView: () => {
      return initialState;
    },
  },
});

export const {
  setFeedView,
  setFeedViewOffset,
  setFeedViewVersion,
  setFeedViewFetchedVersion,
  setFeedViewLoaded,
  setFeedViewReqStatus,
  resetFeedView,
} = feedViewSlice.actions;
export default feedViewSlice.reducer;

export const selectFeedView = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.items,
);

export const selectFeedViewOffset = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.offset,
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
