import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { NFTActivity } from 'enevti-app/types/core/chain/nft/NFTActivity';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';

type NFTDetailsViewState = NFT & {
  activityPagination: PaginationStore;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
  liked: boolean;
};

type NFTDetailsViewStore = {
  [key: string]: NFTDetailsViewState;
};

const initialStateItem: NFTDetailsViewState = {
  activityPagination: {
    checkpoint: 0,
    version: 0,
  },
  fetchedVersion: 0,
  version: 0,
  loaded: false,
  reqStatus: 0,
  id: '',
  collectionId: '',
  like: 0,
  liked: false,
  comment: 0,
  createdOn: 0,
  name: '',
  description: '',
  symbol: '',
  serial: '',
  data: {
    cid: '',
    mime: '',
    extension: '',
    size: -1,
    protocol: 'ipfs',
  },
  template: {
    main: [],
    thumbnail: [],
  },
  nftType: '',
  utility: '',
  partition: {
    parts: [],
    upgradeMaterial: -1,
  },
  rarity: {
    stat: {
      rank: -1,
      percent: -1,
    },
    trait: [],
  },
  price: {
    amount: '',
    currency: '',
  },
  onSale: false,
  redeem: {
    status: '',
    count: -1,
    limit: -1,
    touched: -1,
    secret: {
      cipher: '',
      signature: {
        cipher: '',
        plain: '',
      },
      sender: '',
      recipient: '',
    },
    content: {
      cid: '',
      mime: '',
      extension: '',
      size: -1,
      protocol: 'ipfs',
      iv: '',
      salt: '',
      version: 0,
    },
    schedule: {
      recurring: '',
      time: {
        day: -1,
        date: -1,
        month: -1,
        year: -1,
      },
      from: {
        hour: -1,
        minute: -1,
      },
      until: -1,
    },
  },
  owner: {
    address: '',
    base32: '',
    username: '',
    photo: '',
  },
  creator: {
    address: '',
    base32: '',
    username: '',
    photo: '',
  },
  networkIdentifier: '',
  royalty: {
    creator: -1,
    staker: -1,
  },
  activity: [],
};

const initialState: NFTDetailsViewStore = {};

const nftDetailsViewSlice = createSlice({
  name: 'nftDetailsView',
  initialState,
  reducers: {
    initNFTDetailsView: (nftDetails, action: PayloadAction<string>) => {
      Object.assign(nftDetails, { [action.payload]: {} });
    },
    setNFTDetailsView: (nftDetails, action: PayloadAction<{ key: string; value: Record<string, any> }>) => {
      Object.assign(nftDetails, { [action.payload.key]: action.payload.value });
    },
    addNFTDetailsViewLike: (nftDetails, action: PayloadAction<{ key: string }>) => {
      nftDetails[action.payload.key].liked = true;
      nftDetails[action.payload.key].like++;
    },
    unshiftNFTDetailsViewActivity: (nftDetails, action: PayloadAction<{ key: string; value: NFTActivity[] }>) => {
      nftDetails[action.payload.key].activity = nftDetails[action.payload.key].activity.concat(action.payload.value);
    },
    pushNFTDetailsViewActivity: (nftDetails, action: PayloadAction<{ key: string; value: NFTActivity[] }>) => {
      nftDetails[action.payload.key].activity = action.payload.value.concat(nftDetails[action.payload.key].activity);
    },
    setNFTDetailsViewActivityPagination: (
      nftDetails,
      action: PayloadAction<{ key: string; value: PaginationStore }>,
    ) => {
      nftDetails[action.payload.key].activityPagination = { ...action.payload.value };
    },
    setNFTDetailsViewSecret: (nftDetails, action: PayloadAction<{ key: string; value: NFT['redeem']['secret'] }>) => {
      nftDetails[action.payload.key].redeem.secret = { ...action.payload.value };
    },
    setNFTDetailsFetchedVersion: (nftDetails, action: PayloadAction<{ key: string; value: number }>) => {
      nftDetails[action.payload.key].fetchedVersion = action.payload.value;
    },
    setNFTDetailsVersion: (nftDetails, action: PayloadAction<{ key: string; value: number }>) => {
      nftDetails[action.payload.key].version = action.payload.value;
    },
    setNFTDetailsLoaded: (nftDetails, action: PayloadAction<{ key: string; value: boolean }>) => {
      nftDetails[action.payload.key].loaded = action.payload.value;
    },
    setNFTDetailsReqStatus: (nftDetails, action: PayloadAction<{ key: string; value: number }>) => {
      nftDetails[action.payload.key].reqStatus = action.payload.value;
    },
    clearNFTDetailsByKey: (nftDetails, action: PayloadAction<string>) => {
      delete nftDetails[action.payload];
    },
    resetNFTDetailsByKey: (nftDetails, action: PayloadAction<string>) => {
      Object.assign(nftDetails[action.payload], initialStateItem);
    },
    resetNFTDetailsView: () => {
      return initialState;
    },
  },
});

export const {
  initNFTDetailsView,
  setNFTDetailsView,
  addNFTDetailsViewLike,
  unshiftNFTDetailsViewActivity,
  pushNFTDetailsViewActivity,
  setNFTDetailsViewActivityPagination,
  setNFTDetailsViewSecret,
  setNFTDetailsLoaded,
  setNFTDetailsFetchedVersion,
  setNFTDetailsVersion,
  setNFTDetailsReqStatus,
  resetNFTDetailsView,
  clearNFTDetailsByKey,
  resetNFTDetailsByKey,
} = nftDetailsViewSlice.actions;
export default nftDetailsViewSlice.reducer;

export const selectNFTDetailsView = createSelector(
  [(state: RootState) => state.ui.view.nftDetails, (state: RootState, key: string) => key],
  (nftDetails: NFTDetailsViewStore, key: string) =>
    nftDetails.hasOwnProperty(key) ? nftDetails[key] : initialStateItem,
);

export const selectNFTDetailsViewActivity = createSelector(
  [(state: RootState) => state.ui.view.nftDetails, (state: RootState, key: string) => key],
  (nftDetails: NFTDetailsViewStore, key: string) => (nftDetails.hasOwnProperty(key) ? nftDetails[key].activity : []),
);

export const isNFTDetailsUndefined = createSelector(
  [(state: RootState) => state.ui.view.nftDetails, (state: RootState, key: string) => key],
  (nftDetails: NFTDetailsViewStore, key: string) => (nftDetails.hasOwnProperty(key) ? !nftDetails[key].loaded : true),
);

export const isThereAnyNewNFTUpdates = createSelector(
  [(state: RootState) => state.ui.view.nftDetails, (state: RootState, key: string) => key],
  (nftDetails: NFTDetailsViewStore, key: string) =>
    nftDetails.hasOwnProperty(key) ? nftDetails[key].fetchedVersion > nftDetails[key].version : false,
);
