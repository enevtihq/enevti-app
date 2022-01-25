import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../state';

interface SnackbarState {
  mode: 'info' | 'error' | undefined;
  show: boolean;
  text: string;
}

const initialState: SnackbarState = { mode: undefined, show: false, text: '' };

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      snackbar,
      action: PayloadAction<{ mode: SnackbarState['mode']; text: string }>,
    ) => {
      snackbar.mode = action.payload.mode;
      snackbar.show = true;
      snackbar.text = action.payload.text;
    },
    hideSnackbar: snackbar => {
      snackbar.mode = undefined;
      snackbar.show = false;
      snackbar.text = '';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;

export const getSnackBarState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.snackbar,
);
