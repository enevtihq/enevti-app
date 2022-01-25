import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const localSessionSlice = createSlice({
  name: 'local',
  initialState: { key: '' },
  reducers: {
    setLocalSessionKey: (local, action: PayloadAction<string>) => {
      local.key = action.payload;
    },
  },
});

export const { setLocalSessionKey } = localSessionSlice.actions;
export default localSessionSlice.reducer;
