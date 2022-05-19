import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { CollectionBase } from 'enevti-app/types/core/chain/collection';

type MyProfileViewState = ProfileView & { version: number; fetchedVersion: number; reqStatus: number; loaded: boolean };

const initialState: MyProfileViewState = {
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
    addMyProfileViewOwnedNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.owned = action.payload.concat(profile.owned);
    },
    addMyProfileViewOnsaleNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.onSale = action.payload.concat(profile.onSale);
    },
    addMyProfileViewCollection: (profile, action: PayloadAction<CollectionBase[]>) => {
      profile.collection = action.payload.concat(profile.collection);
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
  addMyProfileViewOwnedNFT,
  addMyProfileViewOnsaleNFT,
  setMyProfileViewPending,
  addMyProfileViewCollection,
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

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => !profile.loaded,
);

export const isThereAnyNewMyProfileUpdates = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile.fetchedVersion > profile.version,
);
