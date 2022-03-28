import { getCollection } from '../../../../../service/enevti/collection';
import { handleError } from '../../../../../utils/error/handle';
import {
  setCollectionViewLoaded,
  setCollectionView,
  resetCollectionView,
} from '../../../../slices/ui/view/collection';
import {
  hideModalLoader,
  showModalLoader,
} from '../../../../slices/ui/global/modalLoader';
import { AppThunk } from '../../../../state';

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
