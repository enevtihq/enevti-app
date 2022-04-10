import { getCollection } from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  clearCollectionById,
} from 'enevti-app/store/slices/ui/view/collection';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';

type LoadCollectionArgs = { id: string; reload: boolean };

export const loadCollection = createAsyncThunk<
  void,
  LoadCollectionArgs,
  AsyncThunkAPI
>(
  'collectionView/loadCollection',
  async ({ id, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const collectionResponse = await getCollection(id, signal);
      if (collectionResponse) {
        dispatch(setCollectionView(collectionResponse));
        dispatch(setCollectionViewLoaded({ id, value: true }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadCollection =
  (id: string): AppThunk =>
  dispatch => {
    dispatch(clearCollectionById(id));
  };
