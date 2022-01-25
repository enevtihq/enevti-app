import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
