import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { assignDeep } from 'enevti-app/utils/primitive/object';
import { Moment } from 'enevti-app/types/core/chain/moment';

type MomentsData = Moment & { liked?: boolean };

type MomentViewState = {
  momentPagination: PaginationStore;
  loaded: boolean;
  reqStatus: number;
  moments: MomentsData[];
};

type MomentViewStore = {
  [key: string]: MomentViewState;
};

export const momentInitialStateItem: MomentViewState = {
  momentPagination: {
    checkpoint: 0,
    version: 0,
  },
  loaded: false,
  reqStatus: 0,
  moments: [],
};

const initialStateItem = momentInitialStateItem;

const initialState: MomentViewStore = {};

const momentViewSlice = createSlice({
  name: 'momentView',
  initialState,
  reducers: {
    initMomentView: (moment, action: PayloadAction<string>) => {
      assignDeep(moment, { [action.payload]: initialStateItem });
    },
    setMomentView: (moment, action: PayloadAction<{ key: string; value: Partial<MomentViewState> }>) => {
      assignDeep(moment, { [action.payload.key]: action.payload.value });
    },
    setMomentViewLoaded: (moment, action: PayloadAction<{ key: string; value: boolean }>) => {
      moment[action.payload.key].loaded = action.payload.value;
    },
    unshiftMomentView: (
      moment,
      action: PayloadAction<{ key: string; value: MomentsData[]; pagination: PaginationStore }>,
    ) => {
      moment[action.payload.key].moments = action.payload.value.concat(moment[action.payload.key].moments);
      moment[action.payload.key].momentPagination = { ...action.payload.pagination };
    },
    pushMomentView: (
      moment,
      action: PayloadAction<{ key: string; value: MomentsData[]; pagination: PaginationStore }>,
    ) => {
      moment[action.payload.key].moments = moment[action.payload.key].moments.concat(action.payload.value);
      moment[action.payload.key].momentPagination = { ...action.payload.pagination };
    },
    clearMomentByKey: (moment, action: PayloadAction<string>) => {
      delete moment[action.payload];
    },
    resetMomentByKey: (moment, action: PayloadAction<string>) => {
      assignDeep(moment[action.payload], initialStateItem);
    },
    resetMomentView: () => {
      return initialState;
    },
  },
});

export const {
  initMomentView,
  setMomentViewLoaded,
  setMomentView,
  unshiftMomentView,
  pushMomentView,
  clearMomentByKey,
  resetMomentByKey,
  resetMomentView,
} = momentViewSlice.actions;
export default momentViewSlice.reducer;

export const selectMomentView = createSelector(
  [(state: RootState) => state.ui.view.moment, (state: RootState, key: string) => key],
  (moments: MomentViewStore, key: string) => (moments.hasOwnProperty(key) ? moments[key] : initialStateItem),
);
