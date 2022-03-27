import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../state';

interface StatusBarState {
  background: 'system' | 'light' | 'dark' | 'transparent';
}

const initialState: StatusBarState = { background: 'system' };

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
    resetStatusBarBackground: () => {
      return initialState;
    },
  },
});

export const { setStatusBarBackground, resetStatusBarBackground } =
  statusBarSlice.actions;
export default statusBarSlice.reducer;

export const selectStatusBarState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.statusbar,
);
