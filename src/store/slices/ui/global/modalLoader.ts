import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

interface ModalLoaderState {
  mode: 'activity' | 'progress';
  show: boolean;
  text: string;
  progress: number;
}

const initialState: ModalLoaderState = {
  mode: 'activity',
  show: false,
  text: '',
  progress: 0,
};

const modalLoaderSlice = createSlice({
  name: 'modalLoader',
  initialState: initialState,
  reducers: {
    showModalLoader: loader => {
      loader.show = true;
    },
    hideModalLoader: loader => {
      loader.show = false;
      loader.text = initialState.text;
    },
    setModalLoaderMode: (
      loader,
      action: PayloadAction<'activity' | 'progress'>,
    ) => {
      loader.mode = action.payload;
    },
    resetModalLoaderMode: loader => {
      loader.mode = initialState.mode;
    },
    setModalLoaderProgress: (loader, action: PayloadAction<number>) => {
      loader.progress = action.payload;
    },
    resetModalLoaderProgress: loader => {
      loader.progress = initialState.progress;
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
  setModalLoaderMode,
  resetModalLoaderMode,
  setModalLoaderProgress,
  resetModalLoaderProgress,
  setModalLoaderText,
  resetModalLoaderText,
  setModalLoaderState,
} = modalLoaderSlice.actions;
export default modalLoaderSlice.reducer;

export const selectModalLoaderMode = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader.mode,
);

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

export const selectModalLoaderProgress = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.modalLoader.progress,
);
