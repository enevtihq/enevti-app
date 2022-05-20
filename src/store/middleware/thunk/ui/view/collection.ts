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
import {
  addCollectionUIManager,
  selectUIManager,
  subtractCollectionUIManager,
} from 'enevti-app/store/slices/ui/view/manager';
import { COLLECTION_MINTED_RESPONSE_LIMIT, COLLECTION_ACTIVITY_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];
type LoadCollectionArgs = { routeParam: CollectionRoute; reload: boolean };

export const loadCollection = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadCollection',
  async ({ routeParam, reload = false }, { dispatch, getState, signal }) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.collection[routeParam.arg]) {
      try {
        reload && dispatch(showModalLoader());
        const collectionResponse = await getCollectionByRouteParam(routeParam, signal);
        const mintedResponse = await getCollectionInitialMinted(collectionResponse.data.id, signal);
        const activityResponse = await getCollectionInitialActivity(collectionResponse.data.id, signal);
        dispatch(initCollectionView(routeParam.arg));
        dispatch(
          setCollectionView({
            key: routeParam.arg,
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
            key: routeParam.arg,
            value: { checkpoint: mintedResponse.data.checkpoint, version: mintedResponse.data.version },
          }),
        );
        dispatch(
          setCollectionViewActivityPagination({
            key: routeParam.arg,
            value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
          }),
        );
        dispatch(setCollectionViewReqStatus({ key: routeParam.arg, value: collectionResponse.status }));
      } catch (err: any) {
        handleError(err);
      } finally {
        dispatch(setCollectionViewLoaded({ key: routeParam.arg, value: true }));
        reload && dispatch(hideModalLoader());
      }
    }
    dispatch(addCollectionUIManager(routeParam.arg));
  },
);

export const loadMoreMinted = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadMoreMinted',
  async ({ routeParam }, { dispatch, getState, signal }) => {
    try {
      const collectionView = selectCollectionView(getState(), routeParam.arg);
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
        dispatch(pushCollectionViewMinted({ key: routeParam.arg, value: mintedResponse.data.data }));
        dispatch(
          setCollectionViewMintedPagination({
            key: routeParam.arg,
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
  async ({ routeParam }, { dispatch, getState, signal }) => {
    try {
      const collectionView = selectCollectionView(getState(), routeParam.arg);
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
        dispatch(pushCollectionViewActivity({ key: routeParam.arg, value: activityResponse.data.data }));
        dispatch(
          setCollectionViewActivityPagination({
            key: routeParam.arg,
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
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.collection[key]) {
      dispatch(clearCollectionByKey(key));
    }
    dispatch(subtractCollectionUIManager(key));
  };
