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
import { AppThunk } from 'enevti-app/store/state';

export const loadCollection =
  (id: string, reload: boolean = false): AppThunk =>
  async dispatch => {
    dispatch({ type: 'collectionView/loadCollection' });
    try {
      reload && dispatch(showModalLoader());
      const collectionResponse = await getCollection(id);
      if (collectionResponse) {
        dispatch(setCollectionViewLoaded(true));
        dispatch(setCollectionView(collectionResponse));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  };

export const unloadCollection = (): AppThunk => dispatch => {
  dispatch(resetCollectionView());
};
