import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  selectFeedItemsCache,
  selectLastFetchFeedCache,
  selectReqVersionFeedItemsCache,
  setFeedCacheState,
} from 'enevti-app/store/slices/entities/cache/feed';
import {
  addFeedView,
  resetFeedView,
  selectFeedView,
  selectFeedViewCheckpoint,
  selectFeedViewReqVersion,
  setFeedViewLoaded,
  setFeedViewVersion,
  setFeedViewState,
} from 'enevti-app/store/slices/ui/view/feed';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getHome, getMoreFeeds, parseFeedCache } from 'enevti-app/service/enevti/feed';
import i18n from 'enevti-app/translations/i18n';
import {
  HOME_FEED_LIMIT,
  HOME_MOMENT_LIMIT,
  PROFILE_COLLECTION_INITIAL_LENGTH,
  PROFILE_OWNED_INITIAL_LENGTH,
} from 'enevti-app/utils/constant/limit';
import { myProfileInitialState, setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { setMomentViewLoaded, setMomentViewState, setMomentViewVersion } from 'enevti-app/store/slices/ui/view/moment';
import { selectMomentItemsCache, setMomentItemsCache } from 'enevti-app/store/slices/entities/cache/moment';
import { setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { parseProfileCache } from 'enevti-app/service/enevti/profile';
import { Profile } from 'enevti-app/types/core/account/profile';

type loadFeedsArgs = { reload: boolean };

export const loadFeeds = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeeds',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      const initialProfileState = !reload ? myProfileInitialState : {};
      dispatch(setFeedViewVersion(now));
      dispatch(setMomentViewVersion(now));

      if (reload || now - selectLastFetchFeedCache(getState()) > lastFetchTimeout.home) {
        const homeResponse = await getHome(signal, !reload);
        dispatch(
          setFeedViewState({
            checkpoint: HOME_FEED_LIMIT,
            items: homeResponse.data.feed,
            reqStatus: homeResponse.status,
            reqVersion: homeResponse.version.feed,
            loaded: true,
          }),
        );
        dispatch(
          setMomentViewState({
            checkpoint: HOME_MOMENT_LIMIT,
            items: homeResponse.data.moment,
            reqStatus: homeResponse.status,
            reqVersion: homeResponse.version.moment,
            loaded: true,
          }),
        );
        dispatch(
          setMyProfileView({
            ...initialProfileState,
            ...homeResponse.data.profile,
            render: {
              owned: true,
              onsale: true,
              collection: false,
            },
            version: Date.now(),
            ownedPagination: {
              checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
              version: homeResponse.version.profile.owned,
            },
            collectionPagination: {
              checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
              version: homeResponse.version.profile.collection,
            },
            reqStatus: homeResponse.status,
            loaded: true,
          }),
        );

        if (homeResponse.status === 200 && !isErrorResponse(homeResponse)) {
          dispatch(
            setFeedCacheState({
              lastFetch: now,
              items: parseFeedCache(homeResponse.data.feed),
              reqVersion: homeResponse.version.feed,
            }),
          );
          dispatch(setMomentItemsCache(homeResponse.data.moment));
          dispatch(
            setMyProfileCache({
              ...parseProfileCache(homeResponse.data.profile as Profile),
              lastFetch: {
                profile: now,
                owned: now,
                collection: now,
                onSale: now,
              },
              ownedPagination: {
                checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
                version: homeResponse.version.profile.owned,
              },
              collectionPagination: {
                checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
                version: homeResponse.version.profile.collection,
              },
            }),
          );
        } else {
          throw Error(i18n.t('error:clientError'));
        }
      } else {
        dispatch(
          setFeedViewState({
            items: selectFeedItemsCache(getState()),
            reqStatus: 200,
            reqVersion: selectReqVersionFeedItemsCache(getState()),
            loaded: true,
          }),
        );
        dispatch(
          setMomentViewState({
            items: selectMomentItemsCache(getState()),
            reqStatus: 200,
            reqVersion: selectReqVersionFeedItemsCache(getState()),
            loaded: true,
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
      dispatch(setFeedViewLoaded(true));
      dispatch(setMomentViewLoaded(true));
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
      if (feedItem.length !== version) {
        const feedResponse = await getMoreFeeds(offset, version, signal);
        dispatch(
          addFeedView({
            feed: feedResponse.data.data,
            checkpoint: feedResponse.data.checkpoint,
            reqVersion: feedResponse.data.version,
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

// TODO: load more moments

export const unloadFeeds = (): AppThunk => dispatch => {
  dispatch(resetFeedView());
};
