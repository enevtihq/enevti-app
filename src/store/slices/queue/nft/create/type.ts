import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../../state';

const createNFTTypeQueueSlice = createSlice({
  name: 'type',
  initialState: '',
  reducers: {
    setCreateNFTQueueType: (
      _,
      action: PayloadAction<'onekind' | 'pack' | ''>,
    ) => {
      return action.payload;
    },
    clearCreateNFTQueueType: () => {
      return '';
    },
  },
});

export const { setCreateNFTQueueType, clearCreateNFTQueueType } =
  createNFTTypeQueueSlice.actions;
export default createNFTTypeQueueSlice.reducer;

export const selectCreateNFTTypeQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.type,
);
