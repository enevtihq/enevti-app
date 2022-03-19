import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../../state';

const modalLoaderSlice = createSlice({
  name: 'modalLoader',
  initialState: false,
  reducers: {
    showModalLoader: () => {
      return true;
    },
    hideModalLoader: () => {
      return false;
    },
  },
});

export const { showModalLoader, hideModalLoader } = modalLoaderSlice.actions;
export default modalLoaderSlice.reducer;

export const selectModalLoaderState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader,
);
