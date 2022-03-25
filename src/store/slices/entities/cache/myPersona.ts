import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from '../../../../types/service/enevti/persona';
import { RootState } from '../../../state';

const personaEntitySlice = createSlice({
  name: 'myPersonaCache',
  initialState: { username: '', photo: '', address: '', lastFetch: 0 },
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
  },
});

export const {
  setMyPersonaCache,
  setLastFetchMyPersonaCache,
  setMyPersonaAddressCache,
} = personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectMyPersonaCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myPersona,
);
