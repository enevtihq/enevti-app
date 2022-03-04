import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  CreateNFTOneKind,
  CreateNFTChoosenTemplate,
  CreateNFTOneKindState,
} from '../../../../../types/store/CreateNFTQueue';
import { RootState } from '../../../../state';

export const createNFTOneKindQueueInitialState: CreateNFTOneKind = {
  dataUri: '',
  choosenTemplate: { id: '', data: { main: [], thumbnail: [] } },
  state: {
    name: '',
    description: '',
    data: '',
    contentType: '',
    template: '',
    trait: [],
    symbol: '',
    utility: '',
    recurring: '',
    time: {
      day: 0,
      date: 0,
      month: 0,
      year: 0,
    },
    from: {
      hour: 0,
      minute: 0,
    },
    until: 0,
    redeemLimit: 0,
    royalty: {
      origin: 0,
      staker: 0,
    },
    price: {
      amount: '',
      currency: '',
    },
    quantity: 0,
    mintingExpire: 0,
  },
};

const createNFTOneKindQueueSlice = createSlice({
  name: 'onekind',
  initialState: createNFTOneKindQueueInitialState,
  reducers: {
    setCreateNFTOneKindURI: (onekind, action: PayloadAction<string>) => {
      onekind.dataUri = action.payload;
    },
    setCreateNFTOneKindChosenTemplate: (
      onekind,
      action: PayloadAction<CreateNFTChoosenTemplate>,
    ) => {
      Object.assign(onekind.choosenTemplate, action.payload);
    },
    setCreateNFTOneKindState: (
      onekind,
      action: PayloadAction<CreateNFTOneKindState>,
    ) => {
      Object.assign(onekind.state, action.payload);
    },
    clearCreateNFTQueue: () => {
      return createNFTOneKindQueueInitialState;
    },
  },
});

export const {
  setCreateNFTOneKindURI,
  setCreateNFTOneKindChosenTemplate,
  setCreateNFTOneKindState,
  clearCreateNFTQueue,
} = createNFTOneKindQueueSlice.actions;
export default createNFTOneKindQueueSlice.reducer;

export const selectCreateNFTOneKindQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.onekind,
);
