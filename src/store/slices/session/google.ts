import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../../state';

const googleSessionSlice = createSlice({
  name: 'google',
  initialState: { apiToken: '' },
  reducers: {
    setGoogleAPIToken: (google, action: PayloadAction<string>) => {
      google.apiToken = action.payload;
    },
  },
});

export const { setGoogleAPIToken } = googleSessionSlice.actions;
export default googleSessionSlice.reducer;

export const selectGoogleAPITokenState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.session.google.apiToken,
);
