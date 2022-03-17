import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { NFTTemplateAsset } from '../../../../../types/nft/NFTTemplate';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from '../../../../../types/screen/CreateOneKindContract';
import { CreateNFTOneKind } from '../../../../../types/store/CreateNFTQueue';
import { RootState } from '../../../../state';

export const createNFTOneKindQueueInitialState: CreateNFTOneKind = {
  dataUri: '',
  choosenTemplate: {
    id: '',
    name: '',
    description: '',
    data: { main: [], thumbnail: [] },
  },
  state: {
    name: '',
    description: '',
    symbol: '',
    coverName: '',
    coverSize: 0,
    coverType: '',
    coverUri: '',
    priceAmount: '',
    priceCurrency: '',
    quantity: '',
    mintingExpireOption: '',
    mintingExpire: 1,
    utility: '',
    contentName: '',
    contentSize: 0,
    contentType: '',
    contentUri: '',
    recurring: '',
    timeDay: -1,
    timeDate: -1,
    timeMonth: -1,
    timeYear: -1,
    fromHour: -1,
    fromMinute: -1,
    untilHour: -1,
    untilMinute: -1,
    redeemLimitOption: '',
    redeemLimit: 1,
    royaltyOrigin: 0,
    royaltyStaker: 0,
  },
  status: {
    nameAvailable: true,
    symbolAvailable: true,
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
      action: PayloadAction<NFTTemplateAsset>,
    ) => {
      Object.assign(onekind.choosenTemplate, action.payload);
    },
    setCreateNFTOneKindState: (
      onekind,
      action: PayloadAction<OneKindContractForm>,
    ) => {
      Object.assign(onekind.state, action.payload);
    },
    setCreateNFTOneKindStatus: (
      onekind,
      action: PayloadAction<OneKindContractStatusForm>,
    ) => {
      Object.assign(onekind.status, action.payload);
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
  setCreateNFTOneKindStatus,
  clearCreateNFTQueue,
} = createNFTOneKindQueueSlice.actions;
export default createNFTOneKindQueueSlice.reducer;

export const selectCreateNFTOneKindQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.onekind,
);
