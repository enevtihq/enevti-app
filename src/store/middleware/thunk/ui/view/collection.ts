import { getCollectionByRouteParam } from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  clearCollectionByKey,
} from 'enevti-app/store/slices/ui/view/collection';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];
type LoadCollectionArgs = { routeParam: CollectionRoute; reload: boolean };

export const loadCollection = createAsyncThunk<void, LoadCollectionArgs, AsyncThunkAPI>(
  'collectionView/loadCollection',
  async ({ routeParam, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const collectionResponse = await getCollectionByRouteParam(routeParam, signal);
      if (collectionResponse !== undefined) {
        dispatch(setCollectionView({ key: routeParam.arg, value: collectionResponse }));
        dispatch(setCollectionViewLoaded({ key: routeParam.arg, value: true }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadCollection =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearCollectionByKey(key));
  };
