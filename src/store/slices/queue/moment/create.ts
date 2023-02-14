import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { assignDeep } from 'enevti-app/utils/primitive/object';
import { MintMomentUI } from 'enevti-types/asset/redeemable_nft/mint_moment_asset';
import { NFTBase } from 'enevti-types/chain/nft';

export type CreateMomentState = Omit<MintMomentUI, 'nftId'> & { nft?: NFTBase };

export const createMomentQueueInitialState: CreateMomentState = {
  nft: undefined,
  data: '',
  dataMime: '',
  dataExtension: '',
  dataSize: 0,
  dataProtocol: '',
  cover: '',
  coverMime: '',
  coverExtension: '',
  coverSize: 0,
  coverProtocol: '',
  text: '',
};

const createMomentQueueSlice = createSlice({
  name: 'moment',
  initialState: createMomentQueueInitialState,
  reducers: {
    setCreateMomentQueue: (moment, action: PayloadAction<Partial<CreateMomentState>>) => {
      assignDeep(moment, action.payload);
    },
    setCreateMomentQueueText: (moment, action: PayloadAction<string>) => {
      moment.text = action.payload;
    },
    clearCreateMomentQueue: () => {
      return createMomentQueueInitialState;
    },
  },
});

export const { setCreateMomentQueue, clearCreateMomentQueue, setCreateMomentQueueText } =
  createMomentQueueSlice.actions;
export default createMomentQueueSlice.reducer;

export const selectCreateMomentQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.moment.create,
);

export const selectCreateMomentQueueText = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.moment.create.text,
);
