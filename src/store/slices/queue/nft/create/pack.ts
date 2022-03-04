import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  CreateNFTPack,
  CreateNFTChoosenTemplate,
  CreateNFTPackItemData,
  CreateNFTPackState,
} from '../../../../../types/store/CreateNFTQueue';
import { RootState } from '../../../../state';

export const createNFTPackQueueInitialState: CreateNFTPack = {
  dataUri: [],
  choosenTemplate: { id: '', data: { main: [], thumbnail: [] } },
  state: {
    name: '',
    description: '',
    symbol: '',
    price: {
      amount: '',
      currency: '',
    },
    packSize: 0,
    mintingExpire: 0,
    item: [],
  },
};

const createNFTPackQueueSlice = createSlice({
  name: 'pack',
  initialState: createNFTPackQueueInitialState,
  reducers: {
    setCreateNFTPackURI: (
      pack,
      action: PayloadAction<CreateNFTPackItemData[]>,
    ) => {
      pack.dataUri = action.payload.slice();
    },
    setCreateNFTPackChosenTemplate: (
      pack,
      action: PayloadAction<CreateNFTChoosenTemplate>,
    ) => {
      Object.assign(pack.choosenTemplate, action.payload);
    },
    setCreateNFTPackState: (
      pack,
      action: PayloadAction<CreateNFTPackState>,
    ) => {
      Object.assign(pack.state, action.payload);
    },
    clearCreateNFTQueue: () => {
      return createNFTPackQueueInitialState;
    },
  },
});

export const {
  setCreateNFTPackURI,
  setCreateNFTPackChosenTemplate,
  setCreateNFTPackState,
  clearCreateNFTQueue,
} = createNFTPackQueueSlice.actions;
export default createNFTPackQueueSlice.reducer;

export const selectCreateNFTPackQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.pack,
);
