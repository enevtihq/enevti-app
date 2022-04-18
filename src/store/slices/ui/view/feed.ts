import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/service/enevti/feed';

type FeedViewState = { loaded: boolean; items: Feeds };

const initialState: FeedViewState = {
  loaded: false,
  items: [],
};

const feedViewSlice = createSlice({
  name: 'feedView',
  initialState,
  reducers: {
    setFeedView: (feed, action: PayloadAction<Feeds>) => {
      Object.assign(feed.items, action.payload);
    },
    setFeedViewLoaded: (feed, action: PayloadAction<boolean>) => {
      feed.loaded = action.payload;
    },
    resetFeedView: () => {
      return initialState;
    },
  },
});

export const { setFeedView, setFeedViewLoaded, resetFeedView } =
  feedViewSlice.actions;
export default feedViewSlice.reducer;

export const selectFeedView = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => feed.items,
);

export const isFeedUndefined = createSelector(
  (state: RootState) => state.ui.view.feed,
  (feed: FeedViewState) => !feed.loaded,
);
