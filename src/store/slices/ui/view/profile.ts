import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-types/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-types/chain/nft';
import { CollectionBase } from 'enevti-types/chain/collection';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';

export type ProfileViewState = ProfileView & {
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

type ProfileViewStore = {
  [key: string]: ProfileViewState;
};

export const profileInitialStateItem: ProfileViewState = {
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

const initialStateItem = profileInitialStateItem;

const initialState: ProfileViewStore = {};

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    initProfileView: (profile, action: PayloadAction<string>) => {
      assignDeep(profile, { [action.payload]: initialStateItem });
    },
    setProfileRender: (profile, action: PayloadAction<{ key: string; value: Partial<ProfileViewState['render']> }>) => {
      assignDeep(profile[action.payload.key].render, action.payload.value);
    },
    setProfileView: (profile, action: PayloadAction<{ key: string; value: Partial<ProfileViewState> }>) => {
      assignDeep(profile, {
        [action.payload.key]: action.payload.value,
      });
    },
    addProfileViewMomentLike: (profile, action: PayloadAction<{ key: string; index: number }>) => {
      profile[action.payload.key].momentCreated[action.payload.index].liked = true;
      profile[action.payload.key].momentCreated[action.payload.index].like++;
    },
    unshiftProfileViewOwnedNFT: (profile, action: PayloadAction<{ key: string; value: NFTBase[] }>) => {
      profile[action.payload.key].owned = action.payload.value.concat(profile[action.payload.key].owned);
    },
    unshiftProfileViewOnsaleNFT: (profile, action: PayloadAction<{ key: string; value: NFTBase[] }>) => {
      profile[action.payload.key].onSale = action.payload.value.concat(profile[action.payload.key].onSale);
    },
    unshiftProfileViewCollection: (profile, action: PayloadAction<{ key: string; value: CollectionBase[] }>) => {
      profile[action.payload.key].collection = action.payload.value.concat(profile[action.payload.key].collection);
    },
    pushProfileViewOwnedNFT: (profile, action: PayloadAction<{ key: string; value: NFTBase[] }>) => {
      profile[action.payload.key].owned = profile[action.payload.key].owned.concat(action.payload.value);
    },
    pushProfileViewOnsaleNFT: (profile, action: PayloadAction<{ key: string; value: NFTBase[] }>) => {
      profile[action.payload.key].onSale = profile[action.payload.key].onSale.concat(action.payload.value);
    },
    pushProfileViewCollection: (profile, action: PayloadAction<{ key: string; value: CollectionBase[] }>) => {
      profile[action.payload.key].collection = profile[action.payload.key].collection.concat(action.payload.value);
    },
    setProfileViewOwnedPagination: (profile, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      profile[action.payload.key].ownedPagination = { ...action.payload.value };
    },
    setProfileViewOnsalePagination: (profile, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      profile[action.payload.key].onSalePagination = { ...action.payload.value };
    },
    setProfileViewCollectionPagination: (profile, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      profile[action.payload.key].collectionPagination = { ...action.payload.value };
    },
    setProfileViewMomentPagination: (profile, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      profile[action.payload.key].momentPagination = { ...action.payload.value };
    },
    setProfileViewFetchedVersion: (profile, action: PayloadAction<{ key: string; value: number }>) => {
      profile[action.payload.key].fetchedVersion = action.payload.value;
    },
    setProfileViewVersion: (profile, action: PayloadAction<{ key: string; value: number }>) => {
      profile[action.payload.key].version = action.payload.value;
    },
    setProfileViewPending: (profile, action: PayloadAction<{ key: string; value: number }>) => {
      profile[action.payload.key].pending = action.payload.value;
    },
    setProfileViewLoaded: (profile, action: PayloadAction<{ key: string; value: boolean }>) => {
      profile[action.payload.key].loaded = action.payload.value;
    },
    setProfileViewReqStatus: (profile, action: PayloadAction<{ key: string; value: number }>) => {
      profile[action.payload.key].reqStatus = action.payload.value;
    },
    clearProfileByKey: (profile, action: PayloadAction<string>) => {
      delete profile[action.payload];
    },
    resetProfileByKey: (profile, action: PayloadAction<string>) => {
      assignDeep(profile[action.payload], initialStateItem);
    },
    resetProfileView: () => {
      return initialState;
    },
  },
});

export const {
  initProfileView,
  setProfileRender,
  setProfileView,
  unshiftProfileViewOwnedNFT,
  unshiftProfileViewOnsaleNFT,
  unshiftProfileViewCollection,
  addProfileViewMomentLike,
  pushProfileViewOwnedNFT,
  pushProfileViewOnsaleNFT,
  pushProfileViewCollection,
  setProfileViewOwnedPagination,
  setProfileViewOnsalePagination,
  setProfileViewCollectionPagination,
  setProfileViewMomentPagination,
  setProfileViewFetchedVersion,
  setProfileViewVersion,
  setProfileViewPending,
  setProfileViewLoaded,
  setProfileViewReqStatus,
  resetProfileView,
  clearProfileByKey,
  resetProfileByKey,
} = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key] : initialStateItem),
);

export const selectProfileViewOwned = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key].owned : []),
);

export const selectProfileViewOnsale = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key].onSale : []),
);

export const selectProfileViewCollection = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key].collection : []),
);

export const selectProfileViewMomentCreated = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key].momentCreated : []),
);

export const isProfileUndefined = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? !profile[key].loaded : true),
);

export const isThereAnyNewProfileUpdate = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) =>
    profile.hasOwnProperty(key) ? profile[key].fetchedVersion > profile[key].version : true,
);

export const selectProfileViewRender = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) =>
    profile.hasOwnProperty(key) ? profile[key].render : initialStateItem.render,
);
