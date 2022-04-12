import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import { RootState } from 'enevti-app/store/state';

type CollectionViewState = Collection & { loaded: boolean };

type CollectionViewStore = {
  [key: string]: CollectionViewState;
};

const initialStateItem: CollectionViewState = {
  loaded: false,
  id: '',
  collectionType: '',
  name: '',
  description: '',
  cover: {
    cid: '',
    extension: '',
    mime: '',
    size: 0,
  },
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
    redeemed: 0,
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
  creator: { photo: '', base32: '', username: '', address: '' },
  activity: [],
};

const initialState: CollectionViewStore = {};

const collectionViewSlice = createSlice({
  name: 'collectionView',
  initialState,
  reducers: {
    setCollectionView: (collection, action: PayloadAction<Collection>) => {
      Object.assign(collection, { [action.payload.id]: action.payload });
    },
    setCollectionViewLoaded: (
      collection,
      action: PayloadAction<{ id: string; value: boolean }>,
    ) => {
      collection[action.payload.id].loaded = action.payload.value;
    },
    clearCollectionById: (collection, action: PayloadAction<string>) => {
      delete collection[action.payload];
    },
    resetCollectionById: (collection, action: PayloadAction<string>) => {
      Object.assign(collection[action.payload], initialStateItem);
    },
    resetCollectionView: () => {
      return initialState;
    },
  },
});

export const {
  setCollectionView,
  setCollectionViewLoaded,
  clearCollectionById,
  resetCollectionById,
  resetCollectionView,
} = collectionViewSlice.actions;
export default collectionViewSlice.reducer;

export const selectCollectionView = createSelector(
  [
    (state: RootState) => state.ui.view.collection,
    (state: RootState, id: string) => id,
  ],
  (collections: CollectionViewStore, id: string) =>
    collections.hasOwnProperty(id) ? collections[id] : initialStateItem,
);

export const isCollectionUndefined = createSelector(
  [
    (state: RootState) => state.ui.view.collection,
    (state: RootState, id: string) => id,
  ],
  (collections: CollectionViewStore, id: string) =>
    collections.hasOwnProperty(id) ? !collections[id].loaded : true,
);
