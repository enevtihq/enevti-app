import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../../state';

const createNFTRouteQueueSlice = createSlice({
  name: 'route',
  initialState: '',
  reducers: {
    setCreateNFTQueueRoute: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
    clearCreateNFTQueueRoute: () => {
      return '';
    },
  },
});

export const { setCreateNFTQueueRoute, clearCreateNFTQueueRoute } =
  createNFTRouteQueueSlice.actions;
export default createNFTRouteQueueSlice.reducer;

export const selectCreateNFTRouteQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.route,
);
