import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
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
  setFeedViewVersion,
  setFeedViewState,
} from 'enevti-app/store/slices/ui/view/feed';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import {
  getFeedMoment,
  getHome,
  getMoreFeedMoment,
  getMoreFeeds,
  parseFeedCache,
  parseMomentCache,
} from 'enevti-app/service/enevti/feed';
import i18n from 'enevti-app/translations/i18n';
import {
  HOME_FEED_LIMIT,
  HOME_MOMENT_LIMIT,
  PROFILE_COLLECTION_INITIAL_LENGTH,
  PROFILE_MOMENT_INITIAL_LENGTH,
  PROFILE_OWNED_INITIAL_LENGTH,
} from 'enevti-app/utils/constant/limit';
import { myProfileInitialState, setMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import {
  pushRecentMoment,
  selectRecentMomentState,
  setRecentMomentState,
  setRecentMomentVersion,
} from 'enevti-app/store/slices/ui/view/recentMoment';
import { selectMomentItemsCache, setMomentItemsCache } from 'enevti-app/store/slices/entities/cache/moment';
import { selectMyProfileCache, setMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { parseProfileCache } from 'enevti-app/service/enevti/profile';
import { Profile } from 'enevti-app/types/core/account/profile';
import { setMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';

type loadFeedsArgs = { reload: boolean };

export const loadFeeds = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeeds',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      const initialProfileState = !reload ? myProfileInitialState : {};
      dispatch(setFeedViewVersion(now));
      dispatch(setRecentMomentVersion(now));

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
          setRecentMomentState({
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
              momentCreated: false,
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
            momentPagination: {
              checkpoint: PROFILE_MOMENT_INITIAL_LENGTH,
              version: homeResponse.version.profile.momentCreated,
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
          dispatch(setMomentItemsCache(parseMomentCache(homeResponse.data.moment)));
          dispatch(
            setMyProfileCache({
              ...parseProfileCache(homeResponse.data.profile as Profile),
              lastFetch: {
                profile: now,
                owned: now,
                collection: now,
                onSale: now,
                momentCreated: now,
              },
              ownedPagination: {
                checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
                version: homeResponse.version.profile.owned,
              },
              collectionPagination: {
                checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
                version: homeResponse.version.profile.collection,
              },
              momentPagination: {
                checkpoint: PROFILE_MOMENT_INITIAL_LENGTH,
                version: homeResponse.version.profile.momentCreated,
              },
            }),
          );
          dispatch(setMyPersonaCache({ ...homeResponse.data.profile.persona }));
        } else {
          throw { message: i18n.t('error:clientError'), code: homeResponse.status };
        }
      } else {
        dispatch(loadFeedFromCache() as unknown as AnyAction);
      }
    } catch (err: any) {
      handleError(err);
      dispatch(loadFeedFromCache() as unknown as AnyAction);
    }
  },
);

export const loadFeedFromCache = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'feedView/loadFeedFromCache',
  async (_, { dispatch, getState }) => {
    dispatch(
      setFeedViewState({
        items: selectFeedItemsCache(getState()),
        reqStatus: 200,
        reqVersion: selectReqVersionFeedItemsCache(getState()),
        loaded: true,
      }),
    );
    dispatch(
      setRecentMomentState({
        items: selectMomentItemsCache(getState()),
        reqStatus: 200,
        reqVersion: selectReqVersionFeedItemsCache(getState()),
        loaded: true,
      }),
    );
    dispatch(
      setMyProfileView({
        ...selectMyProfileCache(getState()),
        reqStatus: 200,
        loaded: true,
      }),
    );
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

export const loadFeedsMoment = createAsyncThunk<void, loadFeedsArgs, AsyncThunkAPI>(
  'feedView/loadFeedsMoment',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setFeedViewVersion(now));
      dispatch(setRecentMomentVersion(now));

      if (reload || now - selectLastFetchFeedCache(getState()) > lastFetchTimeout.home) {
        const momentResponse = await getFeedMoment(signal, !reload);
        dispatch(
          setRecentMomentState({
            checkpoint: HOME_MOMENT_LIMIT,
            items: momentResponse.data.data,
            reqStatus: momentResponse.status,
            reqVersion: momentResponse.data.version,
            loaded: true,
          }),
        );

        if (momentResponse.status === 200 && !isErrorResponse(momentResponse)) {
          dispatch(setFeedCacheState({ lastFetch: now }));
          dispatch(setMomentItemsCache(parseMomentCache(momentResponse.data.data)));
        } else {
          throw { message: i18n.t('error:clientError'), code: momentResponse.status };
        }
      } else {
        dispatch(loadFeedFromCache() as unknown as AnyAction);
      }
    } catch (err: any) {
      handleError(err);
      dispatch(loadFeedFromCache() as unknown as AnyAction);
    }
  },
);

export const loadMoreFeedsMoment = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'feedView/loadMoreFeedsMoment',
  async (_, { dispatch, getState, signal }) => {
    try {
      const feedMomentState = selectRecentMomentState(getState());
      const offset = feedMomentState.checkpoint;
      const version = feedMomentState.reqVersion;
      if (feedMomentState.items.length !== version) {
        const momentResponse = await getMoreFeedMoment(offset, version, signal);
        dispatch(
          pushRecentMoment({
            moment: momentResponse.data.data,
            checkpoint: momentResponse.data.checkpoint,
            reqVersion: momentResponse.data.version,
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadFeeds = (): AppThunk => dispatch => {
  dispatch(resetFeedView());
};
