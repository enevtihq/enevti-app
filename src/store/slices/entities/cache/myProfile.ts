import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from 'enevti-types/account/profile';
import { RootState } from 'enevti-app/store/state';
import { NFTBase } from 'enevti-types/chain/nft';
import { CollectionBase } from 'enevti-types/chain/collection';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';

type MyProfileCacheState = Profile & {
  ownedPagination: PaginationStore;
  onSalePagination: PaginationStore;
  collectionPagination: PaginationStore;
  momentPagination: PaginationStore;
  lastFetch: {
    profile: number;
    owned: number;
    onSale: number;
    collection: number;
    momentCreated: number;
  };
};

const initialState: MyProfileCacheState = {
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
  lastFetch: { profile: 0, owned: 0, onSale: 0, collection: 0, momentCreated: 0 },
};

const profileEntitySlice = createSlice({
  name: 'myProfileCache',
  initialState,
  reducers: {
    setMyProfileCache: (profile, action: PayloadAction<Partial<MyProfileCacheState>>) => {
      assignDeep(profile, action.payload);
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
    setMyProfileCacheMomentPagination: (profile, action: PayloadAction<PaginationStore>) => {
      profile.momentPagination = { ...action.payload };
    },
    setMyProfileCachePending: (profile, action: PayloadAction<number>) => {
      profile.pending = action.payload;
    },
    setLastFetchMyProfileCache: (profile, action: PayloadAction<number>) => {
      assignDeep(profile, { lastFetch: { ...profile.lastFetch, profile: action.payload } });
    },
    setLastFetchMyProfileOwnedCache: (profile, action: PayloadAction<number>) => {
      assignDeep(profile, { lastFetch: { ...profile.lastFetch, owned: action.payload } });
    },
    setLastFetchMyProfileOnSaleCache: (profile, action: PayloadAction<number>) => {
      assignDeep(profile, { lastFetch: { ...profile.lastFetch, onSale: action.payload } });
    },
    setLastFetchMyProfileCollectionCache: (profile, action: PayloadAction<number>) => {
      assignDeep(profile, { lastFetch: { ...profile.lastFetch, collection: action.payload } });
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
  setMyProfileCacheMomentPagination,
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
