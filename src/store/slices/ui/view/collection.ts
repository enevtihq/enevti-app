import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Collection, CollectionActivity } from 'enevti-app/types/core/chain/collection';
import { RootState } from 'enevti-app/store/state';
import { NFTType } from 'enevti-app/types/core/chain/nft/NFTType';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';
import { MomentBase } from 'enevti-app/types/core/chain/moment';

type CollectionViewState = Omit<Collection, 'collectionType'> & {
  mintedPagination: PaginationStore;
  activityPagination: PaginationStore;
  momentPagination: PaginationStore;
  collectionType: NFTType | '';
  fetchedVersion: number;
  version: number;
  loaded: boolean;
  reqStatus: number;
  likeDisabled: boolean;
  render: Record<'minted' | 'activity' | 'moment', boolean>;
};

type CollectionViewStore = {
  [key: string]: CollectionViewState;
};

export const collectionInitialStateItem: CollectionViewState = {
  likeDisabled: false,
  render: {
    minted: false,
    activity: false,
    moment: false,
  },
  mintedPagination: {
    checkpoint: 0,
    version: 0,
  },
  activityPagination: {
    checkpoint: 0,
    version: 0,
  },
  momentPagination: {
    checkpoint: 0,
    version: 0,
  },
  raffled: -1,
  liked: false,
  fetchedVersion: 0,
  version: 0,
  loaded: false,
  reqStatus: 0,
  id: '',
  collectionType: '',
  mintingType: '',
  promoted: false,
  name: '',
  description: '',
  cover: {
    cid: '',
    extension: '',
    mime: '',
    size: -1,
    protocol: 'ipfs',
  },
  symbol: '',
  createdOn: 0,
  like: 0,
  comment: 0,
  clubs: 0,
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
  moment: [],
};

const initialStateItem = collectionInitialStateItem;

const initialState: CollectionViewStore = {};

const collectionViewSlice = createSlice({
  name: 'collectionView',
  initialState,
  reducers: {
    initCollectionView: (collection, action: PayloadAction<string>) => {
      assignDeep(collection, { [action.payload]: initialStateItem });
    },
    setCollectionRender: (
      collection,
      action: PayloadAction<{ key: string; value: Partial<CollectionViewState['render']> }>,
    ) => {
      assignDeep(collection[action.payload.key].render, action.payload.value);
    },
    setCollectionView: (collection, action: PayloadAction<{ key: string; value: Partial<CollectionViewState> }>) => {
      assignDeep(collection, { [action.payload.key]: action.payload.value });
    },
    setCollectionViewLike: (collection, action: PayloadAction<{ key: string; value: number }>) => {
      collection[action.payload.key].like = action.payload.value;
    },
    setCollectionViewLikeDisabled: (collection, action: PayloadAction<{ key: string; value: boolean }>) => {
      collection[action.payload.key].likeDisabled = action.payload.value;
    },
    addCollectionViewMomentLike: (collection, action: PayloadAction<{ key: string; index: number }>) => {
      collection[action.payload.key].moment[action.payload.index].liked = true;
      collection[action.payload.key].moment[action.payload.index].like++;
    },
    addCollectionViewLike: (collection, action: PayloadAction<{ key: string }>) => {
      collection[action.payload.key].liked = true;
      collection[action.payload.key].like++;
    },
    unshiftCollectionViewMinted: (collection, action: PayloadAction<{ key: string; value: NFTBase[] }>) => {
      collection[action.payload.key].minted = action.payload.value.concat(collection[action.payload.key].minted);
    },
    unshiftCollectionViewActivity: (
      collection,
      action: PayloadAction<{ key: string; value: CollectionActivity[] }>,
    ) => {
      collection[action.payload.key].activity = action.payload.value.concat(collection[action.payload.key].activity);
    },
    unshiftCollectionViewMoment: (collection, action: PayloadAction<{ key: string; value: MomentBase[] }>) => {
      collection[action.payload.key].moment = action.payload.value.concat(collection[action.payload.key].moment);
    },
    pushCollectionViewMinted: (
      collection,
      action: PayloadAction<{ key: string; value: NFTBase[]; pagination: PaginationStore }>,
    ) => {
      collection[action.payload.key].minted = collection[action.payload.key].minted.concat(action.payload.value);
      collection[action.payload.key].mintedPagination = { ...action.payload.pagination };
    },
    pushCollectionViewActivity: (
      collection,
      action: PayloadAction<{ key: string; value: CollectionActivity[]; pagination: PaginationStore }>,
    ) => {
      collection[action.payload.key].activity = collection[action.payload.key].activity.concat(action.payload.value);
      collection[action.payload.key].activityPagination = { ...action.payload.pagination };
    },
    pushCollectionViewMoment: (
      collection,
      action: PayloadAction<{ key: string; value: MomentBase[]; pagination: PaginationStore }>,
    ) => {
      collection[action.payload.key].moment = collection[action.payload.key].moment.concat(action.payload.value);
      collection[action.payload.key].momentPagination = { ...action.payload.pagination };
    },
    setCollectionViewMintedPagination: (collection, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      collection[action.payload.key].mintedPagination = { ...action.payload.value };
    },
    setCollectionViewActivityPagination: (
      collection,
      action: PayloadAction<{ key: string; value: PaginationStore }>,
    ) => {
      collection[action.payload.key].activityPagination = { ...action.payload.value };
    },
    setCollectionViewFetchedVersion: (collection, action: PayloadAction<{ key: string; value: number }>) => {
      collection[action.payload.key].fetchedVersion = action.payload.value;
    },
    setCollectionViewVersion: (collection, action: PayloadAction<{ key: string; value: number }>) => {
      collection[action.payload.key].version = action.payload.value;
    },
    setCollectionViewLoaded: (collection, action: PayloadAction<{ key: string; value: boolean }>) => {
      collection[action.payload.key].loaded = action.payload.value;
    },
    setCollectionViewReqStatus: (collection, action: PayloadAction<{ key: string; value: number }>) => {
      collection[action.payload.key].reqStatus = action.payload.value;
    },
    clearCollectionByKey: (collection, action: PayloadAction<string>) => {
      delete collection[action.payload];
    },
    resetCollectionByKey: (collection, action: PayloadAction<string>) => {
      assignDeep(collection[action.payload], initialStateItem);
    },
    resetCollectionView: () => {
      return initialState;
    },
  },
});

export const {
  setCollectionRender,
  initCollectionView,
  setCollectionView,
  setCollectionViewLike,
  setCollectionViewLikeDisabled,
  addCollectionViewMomentLike,
  addCollectionViewLike,
  unshiftCollectionViewMinted,
  unshiftCollectionViewActivity,
  unshiftCollectionViewMoment,
  pushCollectionViewMinted,
  pushCollectionViewActivity,
  pushCollectionViewMoment,
  setCollectionViewMintedPagination,
  setCollectionViewActivityPagination,
  setCollectionViewFetchedVersion,
  setCollectionViewVersion,
  setCollectionViewLoaded,
  setCollectionViewReqStatus,
  clearCollectionByKey,
  resetCollectionByKey,
  resetCollectionView,
} = collectionViewSlice.actions;
export default collectionViewSlice.reducer;

export const selectCollectionView = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) =>
    collections.hasOwnProperty(key) ? collections[key] : initialStateItem,
);

export const selectCollectionViewMinted = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) => (collections.hasOwnProperty(key) ? collections[key].minted : []),
);

export const selectCollectionViewLikeDisabled = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) =>
    collections.hasOwnProperty(key) ? collections[key].likeDisabled : false,
);

export const selectCollectionViewActivity = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) => (collections.hasOwnProperty(key) ? collections[key].activity : []),
);

export const selectCollectionViewMoment = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) => (collections.hasOwnProperty(key) ? collections[key].moment : []),
);

export const isCollectionUndefined = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) =>
    collections.hasOwnProperty(key) ? !collections[key].loaded : true,
);

export const isThereAnyNewCollectionUpdates = createSelector(
  [(state: RootState) => state.ui.view.collection, (state: RootState, key: string) => key],
  (collections: CollectionViewStore, key: string) =>
    collections.hasOwnProperty(key) ? collections[key].fetchedVersion > collections[key].version : false,
);
