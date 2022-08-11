import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const chainConfifSyncedEntitySlice = createSlice({
  name: 'chainConfigSynced',
  initialState: false,
  reducers: {
    setChainConfigSynced: () => {
      return true;
    },
    setChainConfigNotSynced: () => {
      return false;
    },
  },
});

export const { setChainConfigSynced, setChainConfigNotSynced } = chainConfifSyncedEntitySlice.actions;
export default chainConfifSyncedEntitySlice.reducer;

export const selectChainConfigSynced = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.chainConfig.synced,
);
