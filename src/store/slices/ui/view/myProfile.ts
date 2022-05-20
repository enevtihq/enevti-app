import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { CollectionBase } from 'enevti-app/types/core/chain/collection';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';

export type MyProfileViewState = ProfileView & {
  ownedPagination: PaginationStore;
  onSalePagination: PaginationStore;
  collectionPagination: PaginationStore;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
};

const initialState: MyProfileViewState = {
  ownedPagination: {
    version: 0,
    checkpoint: 0,
  },
  onSalePagination: {
    version: 0,
    checkpoint: 0,
  },
  collectionPagination: {
    version: 0,
    checkpoint: 0,
  },
  version: 0,
  fetchedVersion: 0,
  loaded: false,
  reqStatus: 0,
  persona: { username: '', photo: '', base32: '', address: '' },
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  social: { twitter: { link: '', stat: 0 } },
  owned: [],
  onSale: [],
  collection: [],
  pending: 0,
};

const myProfileViewSlice = createSlice({
  name: 'myProfileView',
  initialState,
  reducers: {
    setMyProfileView: (profile, action: PayloadAction<Record<string, any>>) => {
      Object.assign(profile, action.payload);
    },
    unshiftMyProfileViewOwnedNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.owned = action.payload.concat(profile.owned);
    },
    unshiftMyProfileViewOnsaleNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.onSale = action.payload.concat(profile.onSale);
    },
    unshiftMyProfileViewCollection: (profile, action: PayloadAction<CollectionBase[]>) => {
      profile.collection = action.payload.concat(profile.collection);
    },
    pushMyProfileViewOwnedNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.owned = profile.owned.concat(action.payload);
    },
    pushMyProfileViewOnsaleNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.onSale = profile.onSale.concat(action.payload);
    },
    pushMyProfileViewCollection: (profile, action: PayloadAction<CollectionBase[]>) => {
      profile.collection = profile.collection.concat(action.payload);
    },
    setMyProfileViewOwnedPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.ownedPagination = { ...action.payload };
    },
    setMyProfileViewOnsalePagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.onSalePagination = { ...action.payload };
    },
    setMyProfileViewCollectionPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.collectionPagination = { ...action.payload };
    },
    setMyProfileViewFetchedVersion: (profile, action: PayloadAction<number>) => {
      profile.fetchedVersion = action.payload;
    },
    setMyProfileViewVersion: (profile, action: PayloadAction<number>) => {
      profile.version = action.payload;
    },
    setMyProfileViewPending: (profile, action: PayloadAction<number>) => {
      profile.pending = action.payload;
    },
    setMyProfileViewLoaded: (profile, action: PayloadAction<boolean>) => {
      profile.loaded = action.payload;
    },
    setMyProfileViewReqStatus: (profile, action: PayloadAction<number>) => {
      profile.reqStatus = action.payload;
    },
    resetMyProfileView: () => {
      return initialState;
    },
  },
});

export const {
  setMyProfileView,
  unshiftMyProfileViewOwnedNFT,
  unshiftMyProfileViewOnsaleNFT,
  unshiftMyProfileViewCollection,
  pushMyProfileViewOwnedNFT,
  pushMyProfileViewOnsaleNFT,
  pushMyProfileViewCollection,
  setMyProfileViewOwnedPagination,
  setMyProfileViewOnsalePagination,
  setMyProfileViewCollectionPagination,
  setMyProfileViewPending,
  setMyProfileViewFetchedVersion,
  setMyProfileViewVersion,
  setMyProfileViewLoaded,
  setMyProfileViewReqStatus,
  resetMyProfileView,
} = myProfileViewSlice.actions;
export default myProfileViewSlice.reducer;

export const selectMyProfileView = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile,
);

export const selectMyProfileViewOwned = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.owned,
);

export const selectMyProfileViewOnsale = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.onSale,
);

export const selectMyProfileViewCollection = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.collection,
);

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => !profile.loaded,
);

export const isThereAnyNewMyProfileUpdates = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.fetchedVersion > profile.version,
);
