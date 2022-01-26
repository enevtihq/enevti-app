import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../state';

const authSlice = createSlice({
  name: 'auth',
  initialState: { type: '', encrypted: false, token: '' },
  reducers: {
    setEncryptedPassphraseAuth: (auth, action: PayloadAction<string>) => {
      auth.type = 'passphrase';
      auth.encrypted = true;
      auth.token = action.payload;
    },
    setUnencryptedPassphraseAuth: (auth, action: PayloadAction<string>) => {
      auth.type = 'passphrase';
      auth.encrypted = false;
      auth.token = action.payload;
    },
  },
});

export const { setEncryptedPassphraseAuth, setUnencryptedPassphraseAuth } =
  authSlice.actions;
export default authSlice.reducer;

export const selectAuthState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.auth,
);
