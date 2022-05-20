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
  lastFetch: number;
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
  pending: 0,
  lastFetch: 0,
};

const profileEntitySlice = createSlice({
  name: 'myProfileCache',
  initialState,
  reducers: {
    setMyProfileCache: (profile, action: PayloadAction<Profile>) => {
      profile.nftSold = action.payload.nftSold;
      profile.treasuryAct = action.payload.treasuryAct;
      profile.serveRate = action.payload.serveRate;
      profile.stake = action.payload.stake;
      profile.balance = action.payload.balance;
      profile.social.twitter.link = action.payload.social.twitter.link;
      profile.social.twitter.stat = action.payload.social.twitter.stat;
      profile.owned = action.payload.owned.slice();
      profile.onSale = action.payload.onSale.slice();
      profile.collection = action.payload.collection.slice();
      profile.pending = action.payload.pending;
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
      profile.lastFetch = action.payload;
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
  resetMyProfileCache,
} = profileEntitySlice.actions;
export default profileEntitySlice.reducer;

export const selectMyProfileCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myProfile,
);
