import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { WALLET_HISTORY_LIMIT } from 'enevti-app/utils/constant/limit';
import { getProfileBalanceByRouteParam } from 'enevti-app/service/enevti/profile';
import {
  getInitialTransactionHistoryByRouteParam,
  getStakeSentByRouteParam,
  getTransactionHistoryByRouteParam,
} from 'enevti-app/service/enevti/wallet';
import {
  clearWalletByKey,
  initWalletView,
  pushWalletHistory,
  selectWalletView,
  setWalletView,
  setWalletViewHistoryPagination,
  setWalletViewLoaded,
  setWalletViewReqStatus,
} from 'enevti-app/store/slices/ui/view/wallet';

type WalletRoute = StackScreenProps<RootStackParamList, 'Wallet'>['route'];
type LoadWalletArgs = { route: WalletRoute; reload: boolean };

export const loadWallet = createAsyncThunk<void, LoadWalletArgs, AsyncThunkAPI>(
  'walletView/loadWallet',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const balanceResponse = await getProfileBalanceByRouteParam(route.params, signal);
      const stakedResponse = await getStakeSentByRouteParam(route.params, signal);
      const transactionHistoryResponse = await getInitialTransactionHistoryByRouteParam(route.params, signal);
      const reqStatusesArray = [balanceResponse.status, stakedResponse.status, transactionHistoryResponse.status];
      let reqStatus = 0;
      if (reqStatusesArray.every(value => value === 200)) {
        reqStatus = 200;
      } else {
        const index = reqStatusesArray.findIndex(t => t !== 200);
        reqStatus = reqStatusesArray[index];
      }
      dispatch(initWalletView(route.key));
      dispatch(
        setWalletView({
          key: route.key,
          value: {
            balance: balanceResponse.data,
            staked: stakedResponse.data.votes,
            history: transactionHistoryResponse.data,
          },
        }),
      );
      dispatch(
        setWalletViewHistoryPagination({
          key: route.key,
          value: { checkpoint: transactionHistoryResponse.meta.count, version: transactionHistoryResponse.meta.total },
        }),
      );
      dispatch(setWalletViewReqStatus({ key: route.key, value: reqStatus }));
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setWalletViewLoaded({ key: route.key, value: true }));
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreTransactionHistory = createAsyncThunk<void, LoadWalletArgs, AsyncThunkAPI>(
  'walletView/loadMoreTransactionHistory',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const walletView = selectWalletView(getState(), route.key);
      const offset = walletView.historyPagination.checkpoint;
      const version = walletView.historyPagination.version;
      if (walletView.history.length !== version) {
        const transactionHistoryResponse = await getTransactionHistoryByRouteParam(
          route.params,
          offset,
          WALLET_HISTORY_LIMIT,
          signal,
        );
        dispatch(pushWalletHistory({ key: route.key, value: transactionHistoryResponse.data }));
        dispatch(
          setWalletViewHistoryPagination({
            key: route.key,
            value: {
              checkpoint: transactionHistoryResponse.meta.count,
              version: transactionHistoryResponse.meta.total,
            },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadWallet =
  (route: WalletRoute): AppThunk =>
  dispatch => {
    dispatch(clearWalletByKey(route.key));
  };
