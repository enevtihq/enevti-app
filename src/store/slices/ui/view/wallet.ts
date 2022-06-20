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
  loaded: true,
  reqStatus: 200,
  balance: '100000074914',
  staked: [
    {
      address: 'envtah8bwbyhdfd4g9xndfa2w5kw9dr5kj6d2nybx6',
      amount: '20000000000',
      username: 'aldhosutra',
    },
    {
      address: 'envtdya75taguwvhes4funwajyexntydvmnt459wt5',
      amount: '20000000000',
      username: 'enevtihq',
    },
  ],
  history: [
    {
      id: '52b666278310259d81254d4ca0256c6ec0189f50c84cc3bcb8ab7f9274ba42a8',
      moduleAssetId: '2:0',
      moduleAssetName: 'token:transfer',
      fee: '10000000',
      height: 3317,
      nonce: '0',
      block: {
        id: '4aef5f18e3739ce8bf96e008846c6f64b6eb167a69a6d99adfa59e1074d10677',
        height: 3317,
        timestamp: 1655616895,
      },
      sender: {
        address: 'envtzv6r64vwmnrvt6fzqde4my9mm5e6wskws9re9q',
        publicKey: 'd8d6efd7e74727b30efccabb96d94e329b9d9ec3a85e376a76cfdf3e03208b59',
        username: 'delegate_77',
      },
      signatures: [
        '2831604924a350175901e639239d12b5f90f750aecc04d8ccbd21dbfc614096c53855893d9e779b8a9d83a268958c6e7c737d9ed103766c2f646d6dc15185003',
      ],
      asset: {
        amount: '200000000000',
        data: '',
        recipient: {
          address: 'envtah8bwbyhdfd4g9xndfa2w5kw9dr5kj6d2nybx6',
        },
      },
      isPending: false,
    },
  ],
};

// const initialStateItem: WalletViewState = {
//   historyPagination: {
//     version: 0,
//     checkpoint: 0,
//   },
//   loaded: false,
//   reqStatus: 0,
//   balance: '',
//   staked: [],
//   history: [],
// };

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
