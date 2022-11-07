import {
  getCollectionByRouteParam,
  getCollectionMinted,
  getCollectionActivity,
} from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  clearCollectionByKey,
  selectCollectionView,
  pushCollectionViewMinted,
  pushCollectionViewActivity,
  collectionInitialStateItem,
} from 'enevti-app/store/slices/ui/view/collection';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  COLLECTION_MINTED_RESPONSE_LIMIT,
  COLLECTION_ACTIVITY_RESPONSE_LIMIT,
  COLLECTION_MINTED_INITIAL_LENGTH,
  COLLECTION_ACTIVITY_INITIAL_LENGTH,
} from 'enevti-app/utils/constant/limit';
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
      const collectionResponse = await getCollectionByRouteParam(route.params, true, signal);
      if (reload && Platform.OS === 'ios') {
        reloadTime = Date.now() - reloadTime;
        await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
      }
      dispatch(
        setCollectionView({
          key: route.key,
          value: {
            ...collectionInitialStateItem,
            ...collectionResponse.data,
            version: Date.now(),
            mintedPagination: {
              checkpoint: COLLECTION_MINTED_INITIAL_LENGTH,
              version: collectionResponse.version.minted,
            },
            activityPagination: {
              checkpoint: COLLECTION_ACTIVITY_INITIAL_LENGTH,
              version: collectionResponse.version.activity,
            },
            reqStatus: collectionResponse.status,
            loaded: true,
          },
        }),
      );
    } catch (err: any) {
      handleError(err);
      dispatch(setCollectionViewLoaded({ key: route.key, value: true }));
    } finally {
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
      if (collectionView.minted.length !== version) {
        const mintedResponse = await getCollectionMinted(
          collectionView.id,
          offset,
          COLLECTION_MINTED_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(
          pushCollectionViewMinted({
            key: route.key,
            value: mintedResponse.data.data,
            pagination: { checkpoint: mintedResponse.data.checkpoint, version: mintedResponse.data.version },
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
      if (collectionView.activity.length !== version) {
        const activityResponse = await getCollectionActivity(
          collectionView.id,
          offset,
          COLLECTION_ACTIVITY_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(
          pushCollectionViewActivity({
            key: route.key,
            value: activityResponse.data.data,
            pagination: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
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
