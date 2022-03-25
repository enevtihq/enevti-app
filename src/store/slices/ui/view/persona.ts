import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from '../../../../types/service/enevti/persona';
import { RootState } from '../../../state';

const personaViewSlice = createSlice({
  name: 'personaView',
  initialState: { username: '', photo: '', address: '' },
  reducers: {
    setPersonaView: (persona, action: PayloadAction<Persona>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
  },
});

export const { setPersonaView } = personaViewSlice.actions;
export default personaViewSlice.reducer;

export const selectPersonaView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.persona,
);
