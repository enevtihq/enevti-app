import {
  getCollectionByRouteParam,
  getCollectionInitialMinted,
  getCollectionInitialActivity,
  getCollectionMinted,
  getCollectionActivity,
} from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  clearCollectionByKey,
  setCollectionViewReqStatus,
  initCollectionView,
  setCollectionViewMintedPagination,
  setCollectionViewActivityPagination,
  selectCollectionView,
  pushCollectionViewMinted,
  pushCollectionViewActivity,
} from 'enevti-app/store/slices/ui/view/collection';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { COLLECTION_MINTED_RESPONSE_LIMIT, COLLECTION_ACTIVITY_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';
import sleep from 'enevti-app/utils/dummy/sleep';
import { Platform } from 'react-native';
import { IOS_MIN_RELOAD_TIME } from 'enevti-app/utils/constant/reload';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route'];
type LoadCollectionArgs = { route: CollectionRoute; reload: boolean };

export const loadCollection = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadCollection',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      let reloadTime = 0;
      if (reload) {
        Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
        dispatch(showModalLoader());
      }
      const collectionResponse = await getCollectionByRouteParam(route.params, signal);
      const mintedResponse = await getCollectionInitialMinted(collectionResponse.data.id, signal);
      const activityResponse = await getCollectionInitialActivity(collectionResponse.data.id, signal);
      if (reload && Platform.OS === 'ios') {
        reloadTime = Date.now() - reloadTime;
        await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
      }
      dispatch(initCollectionView(route.key));
      dispatch(
        setCollectionView({
          key: route.key,
          value: {
            ...collectionResponse.data,
            minted: mintedResponse.data.data,
            activity: activityResponse.data.data,
            version: Date.now(),
          },
        }),
      );
      dispatch(
        setCollectionViewMintedPagination({
          key: route.key,
          value: { checkpoint: mintedResponse.data.checkpoint, version: mintedResponse.data.version },
        }),
      );
      dispatch(
        setCollectionViewActivityPagination({
          key: route.key,
          value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
        }),
      );
      dispatch(setCollectionViewReqStatus({ key: route.key, value: collectionResponse.status }));
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setCollectionViewLoaded({ key: route.key, value: true }));
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreMinted = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadMoreMinted',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const collectionView = selectCollectionView(getState(), route.key);
      const offset = collectionView.mintedPagination.checkpoint;
      const version = collectionView.mintedPagination.version;
      if (collectionView.minted.length - 1 !== version) {
        const mintedResponse = await getCollectionMinted(
          collectionView.id,
          offset,
          COLLECTION_MINTED_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(pushCollectionViewMinted({ key: route.key, value: mintedResponse.data.data }));
        dispatch(
          setCollectionViewMintedPagination({
            key: route.key,
            value: { checkpoint: mintedResponse.data.checkpoint, version: mintedResponse.data.version },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const loadMoreActivity = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadMoreActivity',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const collectionView = selectCollectionView(getState(), route.key);
      const offset = collectionView.activityPagination.checkpoint;
      const version = collectionView.activityPagination.version;
      if (collectionView.activity.length - 1 !== version) {
        const activityResponse = await getCollectionActivity(
          collectionView.id,
          offset,
          COLLECTION_ACTIVITY_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(pushCollectionViewActivity({ key: route.key, value: activityResponse.data.data }));
        dispatch(
          setCollectionViewActivityPagination({
            key: route.key,
            value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadCollection =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearCollectionByKey(key));
  };
