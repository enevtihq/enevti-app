import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { PersonaBase } from '../../../types/service/enevti/persona';
import { RootState } from '../../state';

const personaEntitySlice = createSlice({
  name: 'persona',
  initialState: { username: '', photo: '', address: '', lastFetch: 0 },
  reducers: {
    setPersona: (persona, action: PayloadAction<PersonaBase>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
    setLastFetchPersona: (persona, action: PayloadAction<number>) => {
      persona.lastFetch = action.payload;
    },
  },
});

export const { setPersona, setLastFetchPersona } = personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectPersona = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.persona,
);
