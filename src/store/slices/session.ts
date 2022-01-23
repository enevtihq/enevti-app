import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: { localKey: '' },
  reducers: {
    setLocalKey: (session, action: PayloadAction<string>) => {
      session.localKey = action.payload;
    },
  },
});

export const { setLocalKey } = sessionSlice.actions;
export default sessionSlice.reducer;
