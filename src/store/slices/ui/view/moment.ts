import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-app/types/core/service/feed';

type MomentViewState = {
  checkpoint: number;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  reqVersion: number;
  loaded: boolean;
  items: Moments;
};

const initialState: MomentViewState = {
  checkpoint: 0,
  version: 0,
  fetchedVersion: 0,
  loaded: false,
  reqStatus: 0,
  reqVersion: 0,
  items: [],
};

const momentViewSlice = createSlice({
  name: 'momentView',
  initialState,
  reducers: {
    setMomentViewState: (moment, action: PayloadAction<Partial<MomentViewState>>) => {
      Object.assign(moment, action.payload);
    },
    setMomentView: (moment, action: PayloadAction<Moments>) => {
      moment.items = action.payload.slice();
    },
    setMomentViewVersion: (moment, action: PayloadAction<number>) => {
      moment.version = action.payload;
    },
    setMomentViewFetchedVersion: (moment, action: PayloadAction<number>) => {
      moment.fetchedVersion = action.payload;
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

export const {
  setMomentViewState,
  setMomentView,
  setMomentViewVersion,
  setMomentViewFetchedVersion,
  setMomentViewLoaded,
  setMomentViewReqStatus,
  resetMomentView,
} = momentViewSlice.actions;
export default momentViewSlice.reducer;

export const selectMomentView = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => moment.items,
);

export const isMomentUndefined = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => !moment.loaded,
);

export const isThereAnyNewMomentView = createSelector(
  (state: RootState) => state.ui.view.moment,
  (moment: MomentViewState) => moment.fetchedVersion > moment.version,
);
