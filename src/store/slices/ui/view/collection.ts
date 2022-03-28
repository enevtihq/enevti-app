import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Collection } from '../../../../types/service/enevti/collection';
import { RootState } from '../../../state';

type CollectionViewState = Collection & { loaded: boolean };

const initialState: CollectionViewState = {
  loaded: false,
  id: '',
  collectionType: '',
  name: '',
  description: '',
  cover: '',
  symbol: '',
  createdOn: 0,
  like: 0,
  comment: 0,
  social: {
    twitter: { link: '', stat: 0 },
  },
  packSize: 0,
  stat: {
    minted: 0,
    owner: 0,
    floor: { amount: '', currency: '' },
    volume: { amount: '', currency: '' },
  },
  minting: {
    total: 0,
    available: 0,
    expire: 0,
    price: { amount: '', currency: '' },
  },
  minted: [],
  originAddress: '',
  activity: [],
};

const collectionViewSlice = createSlice({
  name: 'collectionView',
  initialState,
  reducers: {
    setCollectionView: (collection, action: PayloadAction<Collection>) => {
      Object.assign(collection, action.payload);
    },
    setCollectionViewLoaded: (collection, action: PayloadAction<boolean>) => {
      collection.loaded = action.payload;
    },
    resetCollectionView: () => {
      return initialState;
    },
  },
});

export const {
  setCollectionView,
  setCollectionViewLoaded,
  resetCollectionView,
} = collectionViewSlice.actions;
export default collectionViewSlice.reducer;

export const selectCollectionView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.collection,
);

export const isCollectionUndefined = createSelector(
  (state: RootState) => state.ui.view.collection,
  (collection: CollectionViewState) => !collection.loaded,
);
