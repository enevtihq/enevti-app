import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-types/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-types/chain/nft';
import { CollectionBase } from 'enevti-types/chain/collection';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';

export type MyProfileViewState = ProfileView & {
  ownedPagination: PaginationStore;
  onSalePagination: PaginationStore;
  collectionPagination: PaginationStore;
  momentPagination: PaginationStore;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
  render: Record<'owned' | 'onsale' | 'collection' | 'momentCreated', boolean>;
};

export const myProfileInitialState: MyProfileViewState = {
  render: {
    owned: false,
    onsale: false,
    collection: false,
    momentCreated: false,
  },
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
  momentPagination: {
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
  momentCreated: [],
  momentSlot: 0,
  pending: 0,
  raffled: 0,
  likeSent: 0,
  commentSent: 0,
};

const initialState = myProfileInitialState;

const myProfileViewSlice = createSlice({
  name: 'myProfileView',
  initialState,
  reducers: {
    setMyProfileView: (profile, action: PayloadAction<Partial<MyProfileViewState>>) => {
      assignDeep(profile, action.payload);
    },
    setMyProfileRender: (profile, action: PayloadAction<Partial<MyProfileViewState['render']>>) => {
      assignDeep(profile.render, action.payload);
    },
    addMyProfileViewMomentLike: (profile, action: PayloadAction<{ index: number }>) => {
      profile.momentCreated[action.payload.index].liked = true;
      profile.momentCreated[action.payload.index].like++;
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
    setMyProfileViewMomentPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.momentPagination = { ...action.payload };
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
  setMyProfileRender,
  addMyProfileViewMomentLike,
  unshiftMyProfileViewOwnedNFT,
  unshiftMyProfileViewOnsaleNFT,
  unshiftMyProfileViewCollection,
  pushMyProfileViewOwnedNFT,
  pushMyProfileViewOnsaleNFT,
  pushMyProfileViewCollection,
  setMyProfileViewOwnedPagination,
  setMyProfileViewOnsalePagination,
  setMyProfileViewCollectionPagination,
  setMyProfileViewMomentPagination,
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

export const selectMyProfileViewMomentCreated = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.momentCreated,
);

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => !profile.loaded,
);

export const isThereAnyNewMyProfileUpdates = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.fetchedVersion > profile.version,
);

export const selectMyProfileViewRender = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.render,
);
