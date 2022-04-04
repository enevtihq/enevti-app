import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { NFTTemplateAsset } from 'enevti-app/types/nft/NFTTemplate';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from 'enevti-app/types/screen/CreateOneKindContract';
import { CreateNFTOneKind } from 'enevti-app/types/store/CreateNFTQueue';
import { RootState } from 'enevti-app/store/state';

export const createNFTOneKindQueueInitialState: CreateNFTOneKind = {
  data: {
    uri: '',
    mime: '',
    size: -1,
  },
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
    priceCurrency: COIN_NAME,
    quantity: '',
    mintingExpireOption: '',
    mintingExpire: '',
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
    redeemLimit: '',
    royaltyOrigin: '',
    royaltyStaker: '',
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
    setCreateNFTOneKindData: (
      onekind,
      action: PayloadAction<CreateNFTOneKind['data']>,
    ) => {
      onekind.data.uri = action.payload.uri;
      onekind.data.mime = action.payload.mime;
      onekind.data.size = action.payload.size;
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
    clearCreateNFTOneKindQueue: () => {
      return createNFTOneKindQueueInitialState;
    },
  },
});

export const {
  setCreateNFTOneKindData,
  setCreateNFTOneKindChosenTemplate,
  setCreateNFTOneKindState,
  setCreateNFTOneKindStatus,
  clearCreateNFTOneKindQueue,
} = createNFTOneKindQueueSlice.actions;
export default createNFTOneKindQueueSlice.reducer;

export const selectCreateNFTOneKindQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.onekind,
);
