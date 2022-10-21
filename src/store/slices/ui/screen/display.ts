import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

export type DisplayInitialState = {
  current: string;
  maximized: boolean;
};

const initialState: DisplayInitialState = {
  current: '',
  maximized: true,
};

const displaySlice = createSlice({
  name: 'display',
  initialState: initialState as DisplayInitialState,
  reducers: {
    setDisplayScreenState: (display, action: PayloadAction<string>) => {
      display.current = action.payload;
    },
    setDisplayMaximized: display => {
      display.maximized = true;
    },
    setDisplayMinimized: display => {
      display.maximized = false;
    },
    resetDisplayScreenState: () => {
      return initialState;
    },
  },
});

export const { setDisplayScreenState, setDisplayMaximized, setDisplayMinimized, resetDisplayScreenState } =
  displaySlice.actions;
export default displaySlice.reducer;

export const selectDisplayState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.screen.display,
);
