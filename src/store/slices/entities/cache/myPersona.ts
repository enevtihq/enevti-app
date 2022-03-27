import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from '../../../../types/service/enevti/persona';
import { RootState } from '../../../state';

type PersonaCacheState = Persona & { lastFetch: number };

const initialState: PersonaCacheState = {
  username: '',
  photo: '',
  address: '',
  lastFetch: 0,
};

const personaEntitySlice = createSlice({
  name: 'myPersonaCache',
  initialState,
  reducers: {
    setMyPersonaCache: (persona, action: PayloadAction<Persona>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
    setLastFetchMyPersonaCache: (persona, action: PayloadAction<number>) => {
      persona.lastFetch = action.payload;
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
  setMyPersonaAddressCache,
  resetMyPersonaCache,
} = personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectMyPersonaCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myPersona,
);
