import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

interface KeyboardState {
  status: 'show' | 'hide';
}

const initialState: KeyboardState = {
  status: 'hide',
};

const keyboardState = createSlice({
  name: 'keyboard',
  initialState: initialState,
  reducers: {
    setKeyboardShow: keyboard => {
      keyboard.status = 'show';
    },
    setKeyboardHide: keyboard => {
      keyboard.status = 'hide';
    },
  },
});

export const { setKeyboardHide, setKeyboardShow } = keyboardState.actions;
export default keyboardState.reducer;

export const selectKeyboardStatus = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.global.keyboard.status,
);
