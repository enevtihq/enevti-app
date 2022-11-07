import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { StakePoolData, StakerItem } from 'enevti-app/types/core/chain/stake';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';

type StakePoolViewState = StakePoolData & {
  stakerPagination: PaginationStore;
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
};

type StakePoolViewStore = {
  [key: string]: StakePoolViewState;
};

export const stakePoolInitialStateItem: StakePoolViewState = {
  stakerPagination: {
    checkpoint: 0,
    version: 0,
  },
  loaded: false,
  reqStatus: 0,
  version: 0,
  fetchedVersion: 0,
  owner: { username: '', photo: '', base32: '', address: '' },
  staker: [],
};

const initialStateItem = stakePoolInitialStateItem;

const initialState: StakePoolViewStore = {};

const stakePoolViewSlice = createSlice({
  name: 'stakePoolView',
  initialState,
  reducers: {
    initStakePoolView: (stakePool, action: PayloadAction<string>) => {
      Object.assign(stakePool, { [action.payload]: initialStateItem });
    },
    setStakePoolView: (stakePool, action: PayloadAction<{ key: string; value: Partial<StakePoolViewState> }>) => {
      Object.assign(stakePool, {
        [action.payload.key]: action.payload.value,
      });
    },
    setStakePoolFetchedVersion: (stakePool, action: PayloadAction<{ key: string; value: number }>) => {
      stakePool[action.payload.key].fetchedVersion = action.payload.value;
    },
    pushStakePoolStaker: (
      stakePool,
      action: PayloadAction<{ key: string; value: StakerItem[]; pagination: PaginationStore }>,
    ) => {
      stakePool[action.payload.key].staker = stakePool[action.payload.key].staker.concat(action.payload.value);
      stakePool[action.payload.key].stakerPagination = { ...action.payload.pagination };
    },
    setStakePoolStakerPagination: (stakePool, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      stakePool[action.payload.key].stakerPagination = { ...action.payload.value };
    },
    setStakePoolVersion: (stakePool, action: PayloadAction<{ key: string; value: number }>) => {
      stakePool[action.payload.key].version = action.payload.value;
    },
    setStakePoolLoaded: (stakePool, action: PayloadAction<{ key: string; value: boolean }>) => {
      stakePool[action.payload.key].loaded = action.payload.value;
    },
    setStakePoolReqStatus: (stakePool, action: PayloadAction<{ key: string; value: number }>) => {
      stakePool[action.payload.key].reqStatus = action.payload.value;
    },
    clearStakePoolByKey: (stakePool, action: PayloadAction<string>) => {
      delete stakePool[action.payload];
    },
    resetStakePoolByKey: (stakePool, action: PayloadAction<string>) => {
      Object.assign(stakePool[action.payload], initialStateItem);
    },
    resetStakePoolView: () => {
      return initialState;
    },
  },
});

export const {
  initStakePoolView,
  setStakePoolView,
  setStakePoolFetchedVersion,
  setStakePoolLoaded,
  setStakePoolVersion,
  setStakePoolReqStatus,
  pushStakePoolStaker,
  setStakePoolStakerPagination,
  clearStakePoolByKey,
  resetStakePoolByKey,
  resetStakePoolView,
} = stakePoolViewSlice.actions;
export default stakePoolViewSlice.reducer;

export const selectStakePoolOwnerView = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key) ? stakePool[key].owner : initialStateItem.owner,
);

export const selectStakePoolView = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) => (stakePool.hasOwnProperty(key) ? stakePool[key] : initialStateItem),
);

export const selectStakePoolViewStaker = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) => (stakePool.hasOwnProperty(key) ? stakePool[key].staker : []),
);

export const isThereAnyNewStaker = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key) ? stakePool[key].fetchedVersion > stakePool[key].version : false,
);

export const isStakePoolUndefined = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) => (stakePool.hasOwnProperty(key) ? !stakePool[key].loaded : true),
);
