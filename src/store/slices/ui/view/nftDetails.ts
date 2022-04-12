import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/nft';

type NFTDetailsViewState = NFT & { loaded: boolean };

type NFTDetailsViewStore = {
  [key: string]: NFTDetailsViewState;
};

const initialStateItem: NFTDetailsViewState = {
  loaded: false,
  id: '',
  collectionId: '',
  like: -1,
  comment: -1,
  createdOn: -1,
  name: '',
  description: '',
  symbol: '',
  serial: '',
  data: {
    cid: '',
    mime: '',
    extension: '',
    size: -1,
  },
  template: {
    main: [],
    thumbnail: [],
  },
  NFTType: '',
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
      signature: '',
      sender: '',
      recipient: '',
    },
    content: {
      cid: '',
      mime: '',
      extension: '',
      size: -1,
      iv: '',
      salt: '',
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
      timezoneOffset: 0,
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
  chain: '',
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
    setNFTDetailsView: (nftDetails, action: PayloadAction<NFT>) => {
      Object.assign(nftDetails, { [action.payload.id]: action.payload });
    },
    setNFTDetailsLoaded: (
      nftDetails,
      action: PayloadAction<{ id: string; value: boolean }>,
    ) => {
      nftDetails[action.payload.id].loaded = action.payload.value;
    },
    clearNFTDetailsById: (nftDetails, action: PayloadAction<string>) => {
      delete nftDetails[action.payload];
    },
    resetNFTDetailsById: (nftDetails, action: PayloadAction<string>) => {
      Object.assign(nftDetails[action.payload], initialStateItem);
    },
    resetNFTDetailsView: () => {
      return initialState;
    },
  },
});

export const {
  setNFTDetailsView,
  setNFTDetailsLoaded,
  resetNFTDetailsView,
  clearNFTDetailsById,
  resetNFTDetailsById,
} = nftDetailsViewSlice.actions;
export default nftDetailsViewSlice.reducer;

export const selectNFTDetailsView = createSelector(
  [
    (state: RootState) => state.ui.view.nftDetails,
    (state: RootState, id: string) => id,
  ],
  (nftDetails: NFTDetailsViewStore, id: string) =>
    nftDetails.hasOwnProperty(id) ? nftDetails[id] : initialStateItem,
);

export const isNFTDetailsUndefined = createSelector(
  [
    (state: RootState) => state.ui.view.nftDetails,
    (state: RootState, id: string) => id,
  ],
  (nftDetails: NFTDetailsViewStore, id: string) =>
    nftDetails.hasOwnProperty(id) ? !nftDetails[id].loaded : true,
);
