import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type MyPublicKeyState = { value: string };

const initialState: MyPublicKeyState = {
  value: '',
};

const myPublicKeyEntitySlice = createSlice({
  name: 'myPublicKeyCache',
  initialState,
  reducers: {
    setMyPublicKeyCache: (publicKey, action: PayloadAction<string>) => {
      publicKey.value = action.payload;
    },
    resetMyPublicKeyCache: () => {
      return initialState;
    },
  },
});

export const { setMyPublicKeyCache, resetMyPublicKeyCache } = myPublicKeyEntitySlice.actions;
export default myPublicKeyEntitySlice.reducer;

export const selectMyPublicKeyCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myPublicKey.value,
);
