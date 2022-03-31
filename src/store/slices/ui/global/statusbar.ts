import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../state';

interface StatusBarState {
  background: 'system' | 'light' | 'dark' | 'transparent';
  tint: 'system' | 'light' | 'dark';
}

const initialState: StatusBarState = { background: 'system', tint: 'system' };

const statusBarSlice = createSlice({
  name: 'statusbar',
  initialState,
  reducers: {
    setStatusBarBackground: (
      statusbar,
      action: PayloadAction<StatusBarState['background']>,
    ) => {
      statusbar.background = action.payload;
    },
    setStatusBarTint: (
      statusbar,
      action: PayloadAction<StatusBarState['tint']>,
    ) => {
      statusbar.tint = action.payload;
    },
    resetStatusBarBackground: () => {
      return initialState;
    },
  },
});

export const {
  setStatusBarBackground,
  setStatusBarTint,
  resetStatusBarBackground,
} = statusBarSlice.actions;
export default statusBarSlice.reducer;

export const selectStatusBarState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.statusbar,
);
