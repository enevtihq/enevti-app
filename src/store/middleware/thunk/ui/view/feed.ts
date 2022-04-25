import { handleError } from 'enevti-app/utils/error/handle';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  selectFeedItemsCache,
  selectLastFetchFeedCache,
  setFeedItemsCache,
  setLastFetchFeedCache,
} from 'enevti-app/store/slices/entities/cache/feed';
import {
  resetFeedView,
  setFeedView,
  setFeedViewLoaded,
} from 'enevti-app/store/slices/ui/view/feed';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getFeeds, parseFeedCache } from 'enevti-app/service/enevti/feed';

type loadFeedsArgs = { reload: boolean };

export const loadFeeds = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeeds',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setFeedView(selectFeedItemsCache(getState())));

      if (reload || now - selectLastFetchFeedCache(getState()) > lastFetchTimeout.feed) {
        const feeds = await getFeeds(signal);
        if (feeds !== undefined) {
          dispatch(setFeedView(feeds));
          dispatch(setLastFetchFeedCache(now));
          dispatch(setFeedItemsCache(parseFeedCache(feeds)));
        }
      }

      dispatch(setFeedViewLoaded(true));
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadFeeds = (): AppThunk => dispatch => {
  dispatch(resetFeedView());
};
