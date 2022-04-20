import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { StakePoolData } from 'enevti-app/types/core/chain/stake';

type StakePoolViewState = StakePoolData & { loaded: boolean };

type StakePoolViewStore = {
  [key: string]: StakePoolViewState;
};

const initialStateItem: StakePoolViewState = {
  loaded: false,
  owner: { username: '', photo: '', base32: '', address: '' },
  staker: [],
};

const initialState: StakePoolViewStore = {};

const stakePoolViewSlice = createSlice({
  name: 'stakePoolView',
  initialState,
  reducers: {
    setStakePoolView: (
      stakePool,
      action: PayloadAction<{ key: string; value: StakePoolData }>,
    ) => {
      Object.assign(stakePool, {
        [action.payload.key]: action.payload.value,
      });
    },
    setStakePoolLoaded: (
      stakePool,
      action: PayloadAction<{ key: string; value: boolean }>,
    ) => {
      stakePool[action.payload.key].loaded = action.payload.value;
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
  setStakePoolView,
  setStakePoolLoaded,
  clearStakePoolByKey,
  resetStakePoolByKey,
  resetStakePoolView,
} = stakePoolViewSlice.actions;
export default stakePoolViewSlice.reducer;

export const selectStakePoolOwnerView = createSelector(
  [
    (state: RootState) => state.ui.view.stakePool,
    (state: RootState, key: string) => key,
  ],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key)
      ? stakePool[key].owner
      : initialStateItem.owner,
);

export const selectStakePoolView = createSelector(
  [
    (state: RootState) => state.ui.view.stakePool,
    (state: RootState, key: string) => key,
  ],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key) ? stakePool[key] : initialStateItem,
);

export const isStakePoolUndefined = createSelector(
  [
    (state: RootState) => state.ui.view.stakePool,
    (state: RootState, key: string) => key,
  ],
  (stakePool: StakePoolViewStore, key: string) =>
    stakePool.hasOwnProperty(key) ? !stakePool[key].loaded : true,
);
