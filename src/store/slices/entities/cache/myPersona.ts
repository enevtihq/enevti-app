import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/core/account/persona';
import { RootState } from 'enevti-app/store/state';

type PersonaCacheState = Persona & { lastFetch: number };

const initialState: PersonaCacheState = {
  username: '',
  photo: '',
  address: '',
  base32: '',
  lastFetch: 0,
};

const personaEntitySlice = createSlice({
  name: 'myPersonaCache',
  initialState,
  reducers: {
    setMyPersonaCache: (persona, action: PayloadAction<Partial<PersonaCacheState>>) => {
      Object.assign(persona, action.payload);
    },
    setLastFetchMyPersonaCache: (persona, action: PayloadAction<number>) => {
      persona.lastFetch = action.payload;
    },
    setMyPersonaBase32Cache: (persona, action: PayloadAction<string>) => {
      persona.base32 = action.payload;
    },
    setMyPersonaAddressCache: (persona, action: PayloadAction<string>) => {
      persona.address = action.payload;
    },
    resetMyPersonaCache: () => {
      return initialState;
    },
  },
});

export const {
  setMyPersonaCache,
  setLastFetchMyPersonaCache,
  setMyPersonaBase32Cache,
  setMyPersonaAddressCache,
  resetMyPersonaCache,
} = personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectMyPersonaCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myPersona,
);
