import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

interface ModalLoaderState {
  show: boolean;
  text: string;
}

const initialState: ModalLoaderState = { show: false, text: '' };

const modalLoaderSlice = createSlice({
  name: 'modalLoader',
  initialState: initialState,
  reducers: {
    showModalLoader: loader => {
      loader.show = true;
      loader.text = initialState.text;
    },
    hideModalLoader: loader => {
      loader.show = false;
    },
    setModalLoaderText: (loader, action: PayloadAction<string>) => {
      loader.text = action.payload;
    },
    resetModalLoaderText: loader => {
      loader.text = initialState.text;
    },
    setModalLoaderState: (loader, action: PayloadAction<ModalLoaderState>) => {
      loader.show = action.payload.show;
      loader.text = action.payload.text;
    },
  },
});

export const {
  showModalLoader,
  hideModalLoader,
  setModalLoaderText,
  resetModalLoaderText,
  setModalLoaderState,
} = modalLoaderSlice.actions;
export default modalLoaderSlice.reducer;

export const selectModalLoaderState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader,
);

export const selectModalLoaderShow = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader.show,
);

export const selectModalLoaderMessage = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader.text,
);
