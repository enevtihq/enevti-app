import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSettingSlice = createSlice({
  name: 'userSetting',
  initialState: { theme: 'system', language: 'system' },
  reducers: {
    setTheme: (
      userSetting,
      action: PayloadAction<'system' | 'light' | 'dark'>,
    ) => {
      userSetting.theme = action.payload;
    },
    setLanguage: (userSetting, action: PayloadAction<string>) => {
      userSetting.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = userSettingSlice.actions;
export default userSettingSlice.reducer;
