import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const eligibleEntitySlice = createSlice({
  name: 'eligible',
  initialState: false,
  reducers: {
    touchOnceEligible: () => {
      return true;
    },
  },
});

export const { touchOnceEligible } = eligibleEntitySlice.actions;
export default eligibleEntitySlice.reducer;

export const selectOnceEligible = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.once.eligible,
);
