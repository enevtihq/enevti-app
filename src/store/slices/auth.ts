import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { encrypted: false, token: '' },
  reducers: {
    setEncryptedAuth: (auth, action: PayloadAction<string>) => {
      auth = {
        encrypted: true,
        token: action.payload,
      };
    },
    setUnencryptedAuth: (auth, action: PayloadAction<string>) => {
      auth = {
        encrypted: false,
        token: action.payload,
      };
    },
  },
});

export const { setEncryptedAuth, setUnencryptedAuth } = authSlice.actions;
export default authSlice.reducer;
