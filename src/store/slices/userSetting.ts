import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const userSettingSlice = createSlice({
  name: 'userSetting',
  initialState: { theme: 'system', language: 'system' },
  reducers: {
    setTheme: (userSetting, action: PayloadAction<'system' | 'light' | 'dark'>) => {
      userSetting.theme = action.payload;
    },
    setLanguage: (userSetting, action: PayloadAction<string>) => {
      userSetting.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = userSettingSlice.actions;
export default userSettingSlice.reducer;

export const selectLanguageState = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.userSetting.language,
);
