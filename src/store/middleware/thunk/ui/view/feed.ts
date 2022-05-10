import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
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
  setFeedViewReqStatus,
  setFeedViewVersion,
} from 'enevti-app/store/slices/ui/view/feed';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getFeeds, parseFeedCache } from 'enevti-app/service/enevti/feed';
import { Feeds } from 'enevti-app/types/core/service/feed';

type loadFeedsArgs = { reload: boolean };

export const loadFeeds = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeeds',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setFeedViewVersion(now));
      dispatch(setFeedView(selectFeedItemsCache(getState())));
      dispatch(setFeedViewReqStatus(200));

      if (reload || now - selectLastFetchFeedCache(getState()) > lastFetchTimeout.feed) {
        const feedResponse = await getFeeds(signal);
        if (feedResponse.status === 200 && !isErrorResponse(feedResponse)) {
          dispatch(setLastFetchFeedCache(now));
          dispatch(setFeedItemsCache(parseFeedCache(feedResponse.data as Feeds)));
        }
        dispatch(setFeedView(feedResponse.data as Feeds));
        dispatch(setFeedViewReqStatus(feedResponse.status));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setFeedViewLoaded(true));
    }
  },
);

export const unloadFeeds = (): AppThunk => dispatch => {
  dispatch(resetFeedView());
};
