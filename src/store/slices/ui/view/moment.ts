import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-app/types/core/service/feed';

type MomentViewState = { reqStatus: number; loaded: boolean; items: Moments };

const initialState: MomentViewState = {
  loaded: false,
  reqStatus: 0,
  items: [],
};

const momentViewSlice = createSlice({
  name: 'momentView',
  initialState,
  reducers: {
    setMomentView: (moment, action: PayloadAction<Moments>) => {
      moment.items = action.payload.slice();
    },
    setMomentViewLoaded: (moment, action: PayloadAction<boolean>) => {
      moment.loaded = action.payload;
    },
    setMomentViewReqStatus: (moment, action: PayloadAction<number>) => {
      moment.reqStatus = action.payload;
    },
    resetMomentView: () => {
      return initialState;
    },
  },
});

export const { setMomentView, setMomentViewLoaded, setMomentViewReqStatus, resetMomentView } = momentViewSlice.actions;
export default momentViewSlice.reducer;

export const selectMomentView = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => moment.items,
);

export const isMomentUndefined = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => !moment.loaded,
);
