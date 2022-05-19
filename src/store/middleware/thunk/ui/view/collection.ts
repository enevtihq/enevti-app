import { getCollectionByRouteParam } from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  clearCollectionByKey,
  setCollectionViewReqStatus,
  initCollectionView,
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
        dispatch(initCollectionView(routeParam.arg));
        dispatch(
          setCollectionView({ key: routeParam.arg, value: { ...collectionResponse.data, version: Date.now() } }),
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

export const unloadCollection =
  (key: string): AppThunk =>
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.collection[key]) {
      dispatch(clearCollectionByKey(key));
    }
    dispatch(subtractCollectionUIManager(key));
  };
