import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { NFT } from 'enevti-types/chain/nft';
import { NFTActivity } from 'enevti-types/chain/nft/NFTActivity';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';
import { MomentBase } from 'enevti-types/chain/moment';

type NFTDetailsViewState = NFT & {
  activityPagination: PaginationStore;
  momentPagination: PaginationStore;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
  render: Record<'summary' | 'activity' | 'moment', boolean>;
};

type NFTDetailsViewStore = {
  [key: string]: NFTDetailsViewState;
};

export const nftDetailsInitialStateItem: NFTDetailsViewState = {
  render: {
    summary: false,
    activity: false,
    moment: false,
  },
  activityPagination: {
    checkpoint: 0,
    version: 0,
  },
  momentPagination: {
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
  clubs: 0,
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
    velocity: -1,
    nonce: -1,
    nonceLimit: -1,
    countLimit: -1,
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
      security: '',
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
  moment: [],
};

const initialStateItem = nftDetailsInitialStateItem;

const initialState: NFTDetailsViewStore = {};

const nftDetailsViewSlice = createSlice({
  name: 'nftDetailsView',
  initialState,
  reducers: {
    initNFTDetailsView: (nftDetails, action: PayloadAction<string>) => {
      assignDeep(nftDetails, { [action.payload]: initialStateItem });
    },
    setNFTDetailsRender: (
      nftDetails,
      action: PayloadAction<{ key: string; value: Partial<NFTDetailsViewState['render']> }>,
    ) => {
      assignDeep(nftDetails[action.payload.key].render, action.payload.value);
    },
    setNFTDetailsView: (nftDetails, action: PayloadAction<{ key: string; value: Partial<NFTDetailsViewState> }>) => {
      assignDeep(nftDetails, { [action.payload.key]: action.payload.value });
    },
    setNFTDetailsViewLike: (nftDetails, action: PayloadAction<{ key: string; value: number }>) => {
      nftDetails[action.payload.key].like = action.payload.value;
    },
    addNFTDetailsViewMomentLike: (nftDetails, action: PayloadAction<{ key: string; index: number }>) => {
      nftDetails[action.payload.key].moment[action.payload.index].liked = true;
      nftDetails[action.payload.key].moment[action.payload.index].like++;
    },
    addNFTDetailsViewLike: (nftDetails, action: PayloadAction<{ key: string }>) => {
      nftDetails[action.payload.key].liked = true;
      nftDetails[action.payload.key].like++;
    },
    unshiftNFTDetailsViewActivity: (nftDetails, action: PayloadAction<{ key: string; value: NFTActivity[] }>) => {
      nftDetails[action.payload.key].activity = nftDetails[action.payload.key].activity.concat(action.payload.value);
    },
    pushNFTDetailsViewActivity: (
      nftDetails,
      action: PayloadAction<{ key: string; value: NFTActivity[]; pagination: PaginationStore }>,
    ) => {
      nftDetails[action.payload.key].activity = action.payload.value.concat(nftDetails[action.payload.key].activity);
      nftDetails[action.payload.key].activityPagination = { ...action.payload.pagination };
    },
    unshiftNFTDetailsViewMoment: (nftDetails, action: PayloadAction<{ key: string; value: MomentBase[] }>) => {
      nftDetails[action.payload.key].moment = nftDetails[action.payload.key].moment.concat(action.payload.value);
    },
    pushNFTDetailsViewMoment: (
      nftDetails,
      action: PayloadAction<{ key: string; value: MomentBase[]; pagination: PaginationStore }>,
    ) => {
      nftDetails[action.payload.key].moment = action.payload.value.concat(nftDetails[action.payload.key].moment);
      nftDetails[action.payload.key].momentPagination = { ...action.payload.pagination };
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
      assignDeep(nftDetails[action.payload], initialStateItem);
    },
    resetNFTDetailsView: () => {
      return initialState;
    },
  },
});

export const {
  initNFTDetailsView,
  setNFTDetailsRender,
  setNFTDetailsView,
  addNFTDetailsViewMomentLike,
  addNFTDetailsViewLike,
  setNFTDetailsViewLike,
  unshiftNFTDetailsViewActivity,
  pushNFTDetailsViewActivity,
  unshiftNFTDetailsViewMoment,
  pushNFTDetailsViewMoment,
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

export const selectNFTDetailsViewMoment = createSelector(
  [(state: RootState) => state.ui.view.nftDetails, (state: RootState, key: string) => key],
  (nftDetails: NFTDetailsViewStore, key: string) => (nftDetails.hasOwnProperty(key) ? nftDetails[key].moment : []),
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
