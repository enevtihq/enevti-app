import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../state';

const lockedSlice = createSlice({
  name: 'locked',
  initialState: false,
  reducers: {
    lockScreen: () => {
      return true;
    },
    unlockScreen: () => {
      return false;
    },
  },
});

export const { lockScreen, unlockScreen } = lockedSlice.actions;
export default lockedSlice.reducer;

export const selectLockedState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.screen.locked,
);
