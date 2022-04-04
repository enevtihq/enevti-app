import { getCollection } from 'enevti-app/service/enevti/collection';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  resetCollectionView,
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
        dispatch(setCollectionViewLoaded(true));
        dispatch(setCollectionView(collectionResponse));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadCollection = (): AppThunk => dispatch => {
  dispatch(resetCollectionView());
};
