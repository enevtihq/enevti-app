import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { CollectionBase } from 'enevti-app/types/core/chain/collection';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';

const initialState: Profile & {
  ownedPagination: PaginationStore;
  onSalePagination: PaginationStore;
  collectionPagination: PaginationStore;
  lastFetch: {
    profile: number;
    owned: number;
    onSale: number;
    collection: number;
  };
} = {
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
  lastFetch: { profile: 0, owned: 0, onSale: 0, collection: 0 },
};

const profileEntitySlice = createSlice({
  name: 'myProfileCache',
  initialState,
  reducers: {
    setMyProfileCache: (profile, action: PayloadAction<Profile>) => {
      Object.assign(profile, action.payload);
    },
    unshiftMyProfileCacheOwnedNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.owned = action.payload.concat(profile.owned);
    },
    unshiftMyProfileCacheOnsaleNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.onSale = action.payload.concat(profile.onSale);
    },
    unshiftMyProfileCacheCollection: (profile, action: PayloadAction<CollectionBase[]>) => {
      profile.collection = action.payload.concat(profile.collection);
    },
    pushMyProfileCacheOwnedNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.owned = profile.owned.concat(action.payload);
    },
    pushMyProfileCacheOnsaleNFT: (profile, action: PayloadAction<NFTBase[]>) => {
      profile.onSale = profile.onSale.concat(action.payload);
    },
    pushMyProfileCacheCollection: (profile, action: PayloadAction<CollectionBase[]>) => {
      profile.collection = profile.collection.concat(action.payload);
    },
    setMyProfileCacheOwnedPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.ownedPagination = { ...action.payload };
    },
    setMyProfileCacheOnsalePagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.onSalePagination = { ...action.payload };
    },
    setMyProfileCacheCollectionPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.collectionPagination = { ...action.payload };
    },
    setMyProfileCachePending: (profile, action: PayloadAction<number>) => {
      profile.pending = action.payload;
    },
    setLastFetchMyProfileCache: (profile, action: PayloadAction<number>) => {
      Object.assign(profile, { lastFetch: { ...profile.lastFetch, profile: action.payload } });
    },
    setLastFetchMyProfileOwnedCache: (profile, action: PayloadAction<number>) => {
      Object.assign(profile, { lastFetch: { ...profile.lastFetch, owned: action.payload } });
    },
    setLastFetchMyProfileOnSaleCache: (profile, action: PayloadAction<number>) => {
      Object.assign(profile, { lastFetch: { ...profile.lastFetch, onSale: action.payload } });
    },
    setLastFetchMyProfileCollectionCache: (profile, action: PayloadAction<number>) => {
      Object.assign(profile, { lastFetch: { ...profile.lastFetch, collection: action.payload } });
    },
    resetMyProfileCache: () => {
      return initialState;
    },
  },
});

export const {
  setMyProfileCache,
  unshiftMyProfileCacheOwnedNFT,
  unshiftMyProfileCacheOnsaleNFT,
  unshiftMyProfileCacheCollection,
  pushMyProfileCacheOwnedNFT,
  pushMyProfileCacheOnsaleNFT,
  pushMyProfileCacheCollection,
  setMyProfileCacheCollectionPagination,
  setMyProfileCacheOnsalePagination,
  setMyProfileCacheOwnedPagination,
  setMyProfileCachePending,
  setLastFetchMyProfileCache,
  setLastFetchMyProfileOwnedCache,
  setLastFetchMyProfileOnSaleCache,
  setLastFetchMyProfileCollectionCache,
  resetMyProfileCache,
} = profileEntitySlice.actions;
export default profileEntitySlice.reducer;

export const selectMyProfileCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myProfile,
);

export const selectMyProfileBalanceCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myProfile.balance,
);
