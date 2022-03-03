import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from '../../../types/service/enevti/persona';
import { RootState } from '../../state';

const personaEntitySlice = createSlice({
  name: 'persona',
  initialState: { username: '', photo: '', address: '', lastFetch: 0 },
  reducers: {
    setPersona: (persona, action: PayloadAction<Persona>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
    setLastFetchPersona: (persona, action: PayloadAction<number>) => {
      persona.lastFetch = action.payload;
    },
    setPersonaAddress: (persona, action: PayloadAction<string>) => {
      persona.address = action.payload;
    },
  },
});

export const { setPersona, setLastFetchPersona, setPersonaAddress } =
  personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectPersona = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.persona,
);
