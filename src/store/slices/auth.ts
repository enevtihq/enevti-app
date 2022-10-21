import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { EncryptedData } from 'enevti-app/types/core/service/cryptography';

const initialState = { type: '', encrypted: false, token: '', version: 0 };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEncryptedPassphraseAuth: (auth, action: PayloadAction<EncryptedData>) => {
      auth.type = 'passphrase';
      auth.encrypted = true;
      auth.token = action.payload.data;
      auth.version = action.payload.version;
    },
    setUnencryptedPassphraseAuth: (auth, action: PayloadAction<EncryptedData>) => {
      auth.type = 'passphrase';
      auth.encrypted = false;
      auth.token = action.payload.data;
      auth.version = action.payload.version;
    },
    resetAuthState: () => {
      return initialState;
    },
  },
});

export const { setEncryptedPassphraseAuth, setUnencryptedPassphraseAuth, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.auth,
);
