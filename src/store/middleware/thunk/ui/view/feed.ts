import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  selectFeedItemsCache,
  selectLastFetchFeedCache,
  selectReqVersionFeedItemsCache,
  setFeedCacheReqVersion,
  setFeedItemsCache,
  setLastFetchFeedCache,
} from 'enevti-app/store/slices/entities/cache/feed';
import {
  addFeedView,
  resetFeedView,
  selectFeedView,
  selectFeedViewCheckpoint,
  selectFeedViewReqVersion,
  setFeedView,
  setFeedViewLoaded,
  setFeedViewCheckpoint,
  setFeedViewReqStatus,
  setFeedViewReqVersion,
  setFeedViewVersion,
} from 'enevti-app/store/slices/ui/view/feed';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getFeeds, getMoreFeeds, parseFeedCache } from 'enevti-app/service/enevti/feed';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { loadMyProfile } from './profile';
import i18n from 'enevti-app/translations/i18n';

type loadFeedsArgs = { reload: boolean };

export const loadFeeds = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeeds',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setFeedViewVersion(now));

      if (reload || now - selectLastFetchFeedCache(getState()) > lastFetchTimeout.feed) {
        const feedResponse = await getFeeds(signal, !reload);
        dispatch(setFeedViewCheckpoint(feedResponse.data.checkpoint));

        dispatch(setFeedView(feedResponse.data.data as Feeds));
        dispatch(setFeedViewReqStatus(feedResponse.status));
        dispatch(setFeedViewReqVersion(feedResponse.data.version));

        if (feedResponse.status === 200 && !isErrorResponse(feedResponse)) {
          dispatch(setLastFetchFeedCache(now));
          dispatch(setFeedItemsCache(parseFeedCache(feedResponse.data.data as Feeds)));
          dispatch(setFeedCacheReqVersion(feedResponse.data.version));
        } else {
          throw Error(i18n.t('error:clientError'));
        }
      } else {
        dispatch(setFeedView(selectFeedItemsCache(getState())));
        dispatch(setFeedViewReqStatus(200));
        dispatch(setFeedViewReqVersion(selectReqVersionFeedItemsCache(getState())));
      }

      await loadMyProfile(reload, dispatch, signal);
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setFeedViewLoaded(true));
    }
  },
);

export const loadMoreFeeds = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'feedView/loadMoreFeeds',
  async (_, { dispatch, getState, signal }) => {
    try {
      const feedItem = selectFeedView(getState());
      const offset = selectFeedViewCheckpoint(getState());
      const version = selectFeedViewReqVersion(getState());
      if (feedItem.length - 1 !== version) {
        const feedResponse = await getMoreFeeds(offset, version, signal);
        dispatch(addFeedView(feedResponse.data.data as Feeds));
        dispatch(setFeedViewCheckpoint(feedResponse.data.checkpoint));
        dispatch(setFeedViewReqVersion(feedResponse.data.version));
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadFeeds = (): AppThunk => dispatch => {
  dispatch(resetFeedView());
};
