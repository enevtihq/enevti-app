import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state';
import { createSelector } from 'reselect';

const localSessionSlice = createSlice({
  name: 'local',
  initialState: { key: '' },
  reducers: {
    setLocalSessionKey: (local, action: PayloadAction<string>) => {
      local.key = action.payload;
    },
  },
});

export const { setLocalSessionKey } = localSessionSlice.actions;
export default localSessionSlice.reducer;

export const selectLocalSession = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.session.local,
);
