import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from '../../../types/service/enevti/persona';
import { RootState } from '../../state';

const personaEntitySlice = createSlice({
  name: 'myPersona',
  initialState: { username: '', photo: '', address: '', lastFetch: 0 },
  reducers: {
    setMyPersona: (persona, action: PayloadAction<Persona>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
    setLastFetchMyPersona: (persona, action: PayloadAction<number>) => {
      persona.lastFetch = action.payload;
    },
    setMyPersonaAddress: (persona, action: PayloadAction<string>) => {
      persona.address = action.payload;
    },
  },
});

export const { setMyPersona, setLastFetchMyPersona, setMyPersonaAddress } =
  personaEntitySlice.actions;
export default personaEntitySlice.reducer;

export const selectMyPersona = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.myPersona,
);
