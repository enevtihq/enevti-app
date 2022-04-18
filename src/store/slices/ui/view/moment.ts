import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-app/types/service/enevti/feed';

type MomentViewState = { loaded: boolean; items: Moments };

const initialState: MomentViewState = {
  loaded: false,
  items: [],
};

const momentViewSlice = createSlice({
  name: 'momentView',
  initialState,
  reducers: {
    setMomentView: (moment, action: PayloadAction<Moments>) => {
      Object.assign(moment.items, action.payload);
    },
    setMomentViewLoaded: (moment, action: PayloadAction<boolean>) => {
      moment.loaded = action.payload;
    },
    resetMomentView: () => {
      return initialState;
    },
  },
});

export const { setMomentView, setMomentViewLoaded, resetMomentView } =
  momentViewSlice.actions;
export default momentViewSlice.reducer;

export const selectMomentView = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => moment.items,
);

export const isMomentUndefined = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => !moment.loaded,
);
