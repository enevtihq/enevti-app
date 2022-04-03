import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const lastActiveSlice = createSlice({
  name: 'lastActive',
  initialState: 0,
  reducers: {
    setLastScreenActive: (_, action: PayloadAction<number>) => {
      return action.payload;
    },
    resetLastScreenActive: () => {
      return 0;
    },
  },
});

export const { setLastScreenActive, resetLastScreenActive } =
  lastActiveSlice.actions;
export default lastActiveSlice.reducer;

export const selectLastActiveState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.screen.lastActive,
);
