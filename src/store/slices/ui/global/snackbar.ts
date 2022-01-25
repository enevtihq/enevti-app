import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  mode: string;
  show: boolean;
  text: string;
}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: { mode: '', show: false, text: '' },
  reducers: {
    setSnackbarGlobalState: (
      snackbar,
      action: PayloadAction<SnackbarState>,
    ) => {
      snackbar.mode = action.payload.mode;
      snackbar.show = action.payload.show;
      snackbar.text = action.payload.text;
    },
  },
});

export const { setSnackbarGlobalState } = snackbarSlice.actions;
export default snackbarSlice.reducer;
