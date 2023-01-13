import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Moments } from 'enevti-app/types/core/service/feed';
import { assignDeep } from 'enevti-app/utils/primitive/object';

type RecentMomentState = {
  momentAlertShow: boolean;
  checkpoint: number;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  reqVersion: number;
  loaded: boolean;
  items: Moments;
};

const initialState: RecentMomentState = {
  momentAlertShow: false,
  checkpoint: 0,
  version: 0,
  fetchedVersion: 0,
  loaded: false,
  reqStatus: 0,
  reqVersion: 0,
  items: [],
};

const recentMomentSlice = createSlice({
  name: 'recentMoment',
  initialState,
  reducers: {
    setRecentMomentAlertShow: (recentMoment, action: PayloadAction<boolean>) => {
      recentMoment.momentAlertShow = action.payload;
    },
    setRecentMomentState: (recentMoment, action: PayloadAction<Partial<RecentMomentState>>) => {
      assignDeep(recentMoment, action.payload);
    },
    addRecentMomentLike: (recentMoment, action: PayloadAction<{ index: number }>) => {
      recentMoment.items[action.payload.index].liked = true;
      recentMoment.items[action.payload.index].like++;
    },
    pushRecentMoment: (
      recentMoment,
      action: PayloadAction<{ moment: Moments; reqVersion: number; checkpoint: number }>,
    ) => {
      recentMoment.items = recentMoment.items.concat(action.payload.moment);
      recentMoment.checkpoint = action.payload.checkpoint;
      recentMoment.reqVersion = action.payload.reqVersion;
    },
    setRecentMoment: (recentMoment, action: PayloadAction<Moments>) => {
      recentMoment.items = action.payload.slice();
    },
    setRecentMomentVersion: (recentMoment, action: PayloadAction<number>) => {
      recentMoment.version = action.payload;
    },
    setRecentMomentFetchedVersion: (recentMoment, action: PayloadAction<number>) => {
      recentMoment.fetchedVersion = action.payload;
    },
    setRecentMomentLoaded: (recentMoment, action: PayloadAction<boolean>) => {
      recentMoment.loaded = action.payload;
    },
    setRecentMomentReqStatus: (recentMoment, action: PayloadAction<number>) => {
      recentMoment.reqStatus = action.payload;
    },
    resetRecentMoment: () => {
      return initialState;
    },
  },
});

export const {
  setRecentMomentAlertShow,
  addRecentMomentLike,
  pushRecentMoment,
  setRecentMomentState,
  setRecentMoment,
  setRecentMomentVersion,
  setRecentMomentFetchedVersion,
  setRecentMomentLoaded,
  setRecentMomentReqStatus,
  resetRecentMoment,
} = recentMomentSlice.actions;
export default recentMomentSlice.reducer;

export const selectRecentMoment = createSelector(
  (state: RootState) => state.ui.view.recentMoment,
  (moment: RecentMomentState) => moment.items,
);

export const selectRecentMomentState = createSelector(
  (state: RootState) => state.ui.view.recentMoment,
  (moment: RecentMomentState) => moment,
);

export const selectRecentMomentAlertShow = createSelector(
  (state: RootState) => state.ui.view.recentMoment,
  (moment: RecentMomentState) => moment.momentAlertShow,
);

export const isRecentMomentUndefined = createSelector(
  (state: RootState) => state.ui.view.recentMoment,
  (moment: RecentMomentState) => !moment.loaded,
);

export const isThereAnyNewRecentMoment = createSelector(
  (state: RootState) => state.ui.view.recentMoment,
  (moment: RecentMomentState) => moment.fetchedVersion > moment.version,
);
