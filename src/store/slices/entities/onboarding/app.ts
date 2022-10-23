import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const appOnboardingEntitySlice = createSlice({
  name: 'appOnboarding',
  initialState: false,
  reducers: {
    touchAppOnboarded: () => {
      return true;
    },
  },
});

export const { touchAppOnboarded } = appOnboardingEntitySlice.actions;
export default appOnboardingEntitySlice.reducer;

export const selectAppOnboarded = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.onboarding.app,
);
