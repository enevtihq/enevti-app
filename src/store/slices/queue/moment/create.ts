import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { assignDeep } from 'enevti-app/utils/primitive/object';
import { MintMomentUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_moment_asset';

export const createMomentQueueInitialState: MintMomentUI = {
  nftId: '',
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
    setCreateMomentQueue: (moment, action: PayloadAction<Partial<MintMomentUI>>) => {
      assignDeep(moment, action.payload);
    },
    clearCreateMomentQueue: () => {
      return createMomentQueueInitialState;
    },
  },
});

export const { setCreateMomentQueue, clearCreateMomentQueue } = createMomentQueueSlice.actions;
export default createMomentQueueSlice.reducer;

export const selectCreateMomentQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.moment.create,
);
