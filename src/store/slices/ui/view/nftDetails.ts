import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/nft';

type NFTDetailsViewState = NFT & { loaded: boolean };

const initialState: NFTDetailsViewState = {
  loaded: false,
  id: '',
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
      nonce: '',
      signature: '',
      signer: '',
    },
    content: {
      cid: '',
      mime: '',
      size: -1,
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
    username: '',
    photo: '',
  },
  creator: {
    address: '',
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

const nftDetailsViewSlice = createSlice({
  name: 'nftDetailsView',
  initialState,
  reducers: {
    setNFTDetailsView: (nftDetails, action: PayloadAction<NFT>) => {
      Object.assign(nftDetails, action.payload);
    },
    setNFTDetailsLoaded: (nftDetails, action: PayloadAction<boolean>) => {
      nftDetails.loaded = action.payload;
    },
    resetNFTDetailsView: () => {
      return initialState;
    },
  },
});

export const { setNFTDetailsView, setNFTDetailsLoaded, resetNFTDetailsView } =
  nftDetailsViewSlice.actions;
export default nftDetailsViewSlice.reducer;

export const selectNFTDetailsView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.nftDetails,
);

export const isNFTDetailsUndefined = createSelector(
  (state: RootState) => state.ui.view.nftDetails,
  (nftDetails: NFTDetailsViewState) => !nftDetails.loaded,
);
