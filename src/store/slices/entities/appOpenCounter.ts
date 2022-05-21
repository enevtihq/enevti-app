import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const initialState = {
  value: 0,
};

const appOpenCounterSlice = createSlice({
  name: 'appOpenCounter',
  initialState,
  reducers: {
    addAppOpenCounter: appOpenCounter => {
      appOpenCounter.value += 1;
    },
    resetTransactionNonceCache: () => {
      return initialState;
    },
  },
});

export const { addAppOpenCounter, resetTransactionNonceCache } = appOpenCounterSlice.actions;
export default appOpenCounterSlice.reducer;

export const selectAppOpenCounter = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.appOpenCounter.value,
);
