import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { StakePoolData } from 'enevti-app/types/core/chain/stake';

type StakePoolViewState = StakePoolData & {
  version: number;
  fetchedVersion: number;
  reqStatus: number;
  loaded: boolean;
};

type StakePoolViewStore = {
  [key: string]: StakePoolViewState;
};

const initialStateItem: StakePoolViewState = {
  loaded: false,
  reqStatus: 0,
  version: 0,
  fetchedVersion: 0,
  owner: { username: '', photo: '', base32: '', address: '' },
  staker: [],
};

const initialState: StakePoolViewStore = {};

const stakePoolViewSlice = createSlice({
  name: 'stakePoolView',
  initialState,
  reducers: {
    initStakePoolView: (stakePool, action: PayloadAction<string>) => {
      Object.assign(stakePool, { [action.payload]: {} });
    },
    setStakePoolView: (stakePool, action: PayloadAction<{ key: string; value: Record<string, any> }>) => {
      Object.assign(stakePool, {
        [action.payload.key]: action.payload.value,
      });
    },
    setStakePoolFetchedVersion: (stakePool, action: PayloadAction<{ key: string; value: number }>) => {
      stakePool[action.payload.key].fetchedVersion = action.payload.value;
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
  setStakePoolReqStatus,
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

export const isThereAnyNewStaker = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key) ? stakePool[key].fetchedVersion > stakePool[key].version : false,
);

export const isStakePoolUndefined = createSelector(
  [(state: RootState) => state.ui.view.stakePool, (state: RootState, key: string) => key],
  (stakePool: StakePoolViewStore, key: string) => (stakePool.hasOwnProperty(key) ? !stakePool[key].loaded : true),
);
