import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

const initialState = { state: false, show: false };

const onceLikeEntitySlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    touchOnceLike: onceLike => {
      onceLike.state = true;
    },
    showOnceLike: onceLike => {
      onceLike.show = true;
    },
    hideOnceLike: onceLike => {
      onceLike.show = false;
    },
    resetOnceLike: () => {
      return initialState;
    },
  },
});

export const { touchOnceLike, showOnceLike, hideOnceLike, resetOnceLike } = onceLikeEntitySlice.actions;
export default onceLikeEntitySlice.reducer;

export const selectOnceLike = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.once.like.state,
);

export const selectOnceLikeShow = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.once.like.show,
);
