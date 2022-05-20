import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  getStakePoolDataByRouteParam,
  getStakePoolInitialStaker,
  getStakePoolStaker,
} from 'enevti-app/service/enevti/stake';
import {
  clearStakePoolByKey,
  setStakePoolLoaded,
  setStakePoolView,
  setStakePoolReqStatus,
  initStakePoolView,
  setStakePoolStakerPagination,
  selectStakePoolView,
  pushStakePoolStaker,
} from 'enevti-app/store/slices/ui/view/stakePool';
import {
  addStakePoolUIManager,
  selectUIManager,
  subtractStakePoolUIManager,
} from 'enevti-app/store/slices/ui/view/manager';
import { STAKER_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];
type loadStakePoolArgs = { routeParam: StakePoolRoute; reload: boolean };

export const loadStakePool = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadStakePool',
  async ({ routeParam, reload = false }, { dispatch, getState, signal }) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.stakePool[routeParam.arg]) {
      try {
        reload && dispatch(showModalLoader());
        const now = Date.now();
        const stakePoolResponse = await getStakePoolDataByRouteParam(routeParam, signal);
        const staker = await getStakePoolInitialStaker(stakePoolResponse.data.owner.address, signal);
        dispatch(initStakePoolView(routeParam.arg));
        dispatch(
          setStakePoolView({
            key: routeParam.arg,
            value: { ...stakePoolResponse.data, staker: staker.data.data, version: now },
          }),
        );
        dispatch(
          setStakePoolStakerPagination({
            key: routeParam.arg,
            value: { checkpoint: staker.data.checkpoint, version: staker.data.version },
          }),
        );
        dispatch(setStakePoolReqStatus({ key: routeParam.arg, value: stakePoolResponse.status }));
      } catch (err: any) {
        handleError(err);
      } finally {
        dispatch(setStakePoolLoaded({ key: routeParam.arg, value: true }));
        reload && dispatch(hideModalLoader());
      }
    }
    dispatch(addStakePoolUIManager(routeParam.arg));
  },
);

export const loadMoreStaker = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadMoreStaker',
  async ({ routeParam }, { dispatch, getState, signal }) => {
    try {
      const stakePoolView = selectStakePoolView(getState(), routeParam.arg);
      const offset = stakePoolView.stakerPagination.checkpoint;
      const version = stakePoolView.stakerPagination.version;
      if (stakePoolView.staker.length !== version) {
        const stakerResponse = await getStakePoolStaker(
          stakePoolView.owner.address,
          offset,
          STAKER_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(pushStakePoolStaker({ key: routeParam.arg, value: stakerResponse.data.data }));
        dispatch(
          setStakePoolStakerPagination({
            key: routeParam.arg,
            value: { checkpoint: stakerResponse.data.checkpoint, version: stakerResponse.data.version },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadStakePool =
  (key: string): AppThunk =>
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.stakePool[key]) {
      dispatch(clearStakePoolByKey(key));
    }
    dispatch(subtractStakePoolUIManager(key));
  };
