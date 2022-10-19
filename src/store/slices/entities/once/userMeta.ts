import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const UserMetaEntitySlice = createSlice({
  name: 'UserMeta',
  initialState: false,
  reducers: {
    touchOnceUserMeta: () => {
      return true;
    },
  },
});

export const { touchOnceUserMeta } = UserMetaEntitySlice.actions;
export default UserMetaEntitySlice.reducer;

export const selectOnceUserMeta = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.once.welcome,
);
