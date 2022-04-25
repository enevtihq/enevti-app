import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Feeds } from 'enevti-app/types/core/service/feed';

type FeedViewState = { loaded: boolean; reqStatus: number; items: Feeds };

const initialState: FeedViewState = {
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

export const { setFeedView, setFeedViewLoaded, setFeedViewReqStatus, resetFeedView } =
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
