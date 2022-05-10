import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { RootStackParamList } from 'enevti-app/navigation';

type CreateNFTRoute = keyof RootStackParamList | '';

const initialState: CreateNFTRoute = '';

const createNFTRouteQueueSlice = createSlice({
  name: 'route',
  initialState: initialState as CreateNFTRoute,
  reducers: {
    setCreateNFTQueueRoute: (_, action: PayloadAction<CreateNFTRoute>) => {
      return action.payload;
    },
    clearCreateNFTQueueRoute: () => {
      return '' as '';
    },
  },
});

export const { setCreateNFTQueueRoute, clearCreateNFTQueueRoute } = createNFTRouteQueueSlice.actions;
export default createNFTRouteQueueSlice.reducer;

export const selectCreateNFTRouteQueue = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.queue.nft.create.route,
);
