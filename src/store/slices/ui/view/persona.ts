import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { Persona } from '../../../../types/service/enevti/persona';
import { RootState } from '../../../state';

const initialState = { username: '', photo: '', address: '' };

const personaViewSlice = createSlice({
  name: 'personaView',
  initialState,
  reducers: {
    setPersonaView: (persona, action: PayloadAction<Persona>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
    resetPersonaView: () => {
      return initialState;
    },
  },
});

export const { setPersonaView, resetPersonaView } = personaViewSlice.actions;
export default personaViewSlice.reducer;

export const selectPersonaView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.persona,
);

export const isPersonaUndefined = createSelector(
  (state: RootState) => state.ui.view.persona,
  (persona: Persona) => shallowEqual(persona, initialState),
);
