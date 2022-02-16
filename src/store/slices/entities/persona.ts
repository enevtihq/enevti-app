import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PersonaBase } from '../../../types/service/enevti/persona';

const personaEntitySlice = createSlice({
  name: 'persona',
  initialState: { username: '', photo: '', address: '' },
  reducers: {
    setPersona: (persona, action: PayloadAction<PersonaBase>) => {
      persona.username = action.payload.username;
      persona.photo = action.payload.photo;
      persona.address = action.payload.address;
    },
  },
});

export const { setPersona } = personaEntitySlice.actions;
export default personaEntitySlice.reducer;
