import { AppThunk } from 'enevti-app/store/state';
import { selectCollectionView, setCollectionView } from 'enevti-app/store/slices/ui/view/collection';

export const reduceNewNTotalMinted =
  (payload: any, key: string): AppThunk =>
  (dispatch, getState) => {
    const collectionView = selectCollectionView(getState(), key);
    const newCollectionView = Object.assign({}, collectionView, {
      stat: Object.assign({}, collectionView.stat, { minted: payload }),
    });
    dispatch(setCollectionView({ key, value: newCollectionView }));
  };
