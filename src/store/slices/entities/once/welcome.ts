import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const welcomeEntitySlice = createSlice({
  name: 'welcome',
  initialState: false,
  reducers: {
    touchOnceWelcome: () => {
      return true;
    },
  },
});

export const { touchOnceWelcome } = welcomeEntitySlice.actions;
export default welcomeEntitySlice.reducer;

export const selectOnceWelcome = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.once.welcome,
);
