import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { WalletView } from 'enevti-app/types/core/service/wallet';

export type WalletViewState = WalletView & {
  historyPagination: PaginationStore;
  reqStatus: number;
  loaded: boolean;
};

type WalletViewStore = {
  [key: string]: WalletViewState;
};

const initialStateItem: WalletViewState = {
  historyPagination: {
    version: 0,
    checkpoint: 0,
  },
  loaded: false,
  reqStatus: 0,
  balance: '',
  staked: [],
  history: [],
};

const initialState: WalletViewStore = {};

const walletViewSlice = createSlice({
  name: 'walletView',
  initialState,
  reducers: {
    initWalletView: (wallet, action: PayloadAction<string>) => {
      Object.assign(wallet, { [action.payload]: initialStateItem });
    },
    setWalletView: (wallet, action: PayloadAction<{ key: string; value: Record<string, any> }>) => {
      Object.assign(wallet, {
        [action.payload.key]: action.payload.value,
      });
    },
    unshiftWalletStaked: (wallet, action: PayloadAction<{ key: string; value: WalletView['staked'] }>) => {
      wallet[action.payload.key].staked = action.payload.value.concat(wallet[action.payload.key].staked);
    },
    pushWalletStaked: (wallet, action: PayloadAction<{ key: string; value: WalletView['staked'] }>) => {
      wallet[action.payload.key].staked = wallet[action.payload.key].staked.concat(action.payload.value);
    },
    unshiftWalletHistory: (wallet, action: PayloadAction<{ key: string; value: WalletView['history'] }>) => {
      wallet[action.payload.key].history = action.payload.value.concat(wallet[action.payload.key].history);
    },
    pushWalletHistory: (wallet, action: PayloadAction<{ key: string; value: WalletView['history'] }>) => {
      wallet[action.payload.key].history = wallet[action.payload.key].history.concat(action.payload.value);
    },
    setWalletViewHistoryPagination: (wallet, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      wallet[action.payload.key].historyPagination = { ...action.payload.value };
    },
    setWalletViewLoaded: (wallet, action: PayloadAction<{ key: string; value: boolean }>) => {
      wallet[action.payload.key].loaded = action.payload.value;
    },
    setWalletViewReqStatus: (wallet, action: PayloadAction<{ key: string; value: number }>) => {
      wallet[action.payload.key].reqStatus = action.payload.value;
    },
    setWalletViewBalance: (wallet, action: PayloadAction<{ key: string; value: string }>) => {
      wallet[action.payload.key].balance = action.payload.value;
    },
    setWalletViewStaked: (wallet, action: PayloadAction<{ key: string; value: WalletView['staked'] }>) => {
      Object.assign(wallet, {
        [action.payload.key]: Object.assign(wallet[action.payload.key], { staked: action.payload.value }),
      });
    },
    setWalletViewHistory: (wallet, action: PayloadAction<{ key: string; value: WalletView['history'] }>) => {
      Object.assign(wallet, {
        [action.payload.key]: Object.assign(wallet[action.payload.key], { history: action.payload.value }),
      });
    },
    clearWalletByKey: (wallet, action: PayloadAction<string>) => {
      delete wallet[action.payload];
    },
    resetWalletByKey: (wallet, action: PayloadAction<string>) => {
      Object.assign(wallet[action.payload], initialStateItem);
    },
    resetWalletView: () => {
      return initialState;
    },
  },
});

export const {
  initWalletView,
  setWalletView,
  unshiftWalletStaked,
  pushWalletStaked,
  unshiftWalletHistory,
  pushWalletHistory,
  setWalletViewHistoryPagination,
  setWalletViewLoaded,
  setWalletViewReqStatus,
  setWalletViewBalance,
  setWalletViewStaked,
  setWalletViewHistory,
  clearWalletByKey,
  resetWalletByKey,
  resetWalletView,
} = walletViewSlice.actions;
export default walletViewSlice.reducer;

export const selectWalletView = createSelector(
  [(state: RootState) => state.ui.view.wallet, (state: RootState, key: string) => key],
  (wallet: WalletViewStore, key: string) => (wallet.hasOwnProperty(key) ? wallet[key] : initialStateItem),
);

export const selectWalletViewHistory = createSelector(
  [(state: RootState) => state.ui.view.wallet, (state: RootState, key: string) => key],
  (wallet: WalletViewStore, key: string) => (wallet.hasOwnProperty(key) ? wallet[key].history : []),
);

export const selectWalletViewStaked = createSelector(
  [(state: RootState) => state.ui.view.wallet, (state: RootState, key: string) => key],
  (wallet: WalletViewStore, key: string) => (wallet.hasOwnProperty(key) ? wallet[key].staked : []),
);

export const isWalletUndefined = createSelector(
  [(state: RootState) => state.ui.view.wallet, (state: RootState, key: string) => key],
  (wallet: WalletViewStore, key: string) => (wallet.hasOwnProperty(key) ? !wallet[key].loaded : true),
);