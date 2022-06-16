import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'enevti-app/store/state';
import { createSelector } from 'reselect';

const initialState = { key: '' };

const localSessionSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setLocalSessionKey: (local, action: PayloadAction<string>) => {
      local.key = action.payload;
    },
    resetLocalSessionKey: () => {
      return initialState;
    },
  },
});

export const { setLocalSessionKey, resetLocalSessionKey } = localSessionSlice.actions;
export default localSessionSlice.reducer;

export const selectLocalSession = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.session.local,
);
