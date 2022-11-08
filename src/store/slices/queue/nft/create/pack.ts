import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { CreateNFTPack, CreateNFTPackItemData, CreateNFTPackState } from 'enevti-app/types/ui/store/CreateNFTQueue';
import { RootState } from 'enevti-app/store/state';
import { assignDeep } from 'enevti-app/utils/primitive/object';

export const createNFTPackQueueInitialState: CreateNFTPack = {
  data: [],
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
    price: {
      amount: '',
      currency: '',
    },
    packSize: 0,
    mintingExpire: 0,
    item: [],
  },
  status: {},
};

const createNFTPackQueueSlice = createSlice({
  name: 'pack',
  initialState: createNFTPackQueueInitialState,
  reducers: {
    setCreateNFTPackURI: (pack, action: PayloadAction<CreateNFTPackItemData[]>) => {
      pack.data = action.payload.slice();
    },
    setCreateNFTPackChosenTemplate: (pack, action: PayloadAction<NFTTemplateAsset>) => {
      assignDeep(pack.choosenTemplate, action.payload);
    },
    setCreateNFTPackState: (pack, action: PayloadAction<CreateNFTPackState>) => {
      assignDeep(pack.state, action.payload);
    },
    clearCreateNFTPackQueue: () => {
      return createNFTPackQueueInitialState;
    },
  },
});

export const { setCreateNFTPackURI, setCreateNFTPackChosenTemplate, setCreateNFTPackState, clearCreateNFTPackQueue } =
  createNFTPackQueueSlice.actions;
export default createNFTPackQueueSlice.reducer;

export const selectCreateNFTPackQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.pack,
);
