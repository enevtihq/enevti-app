import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStakePoolDataByRouteParam } from 'enevti-app/service/enevti/stake';
import {
  clearStakePoolByKey,
  setStakePoolLoaded,
  setStakePoolView,
  setStakePoolReqStatus,
  initStakePoolView,
} from 'enevti-app/store/slices/ui/view/stakePool';
import {
  addStakePoolUIManager,
  selectUIManager,
  subtractStakePoolUIManager,
} from 'enevti-app/store/slices/ui/view/manager';

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
        dispatch(initStakePoolView(routeParam.arg));
        dispatch(
          setStakePoolView({
            key: routeParam.arg,
            value: { ...stakePoolResponse.data, version: now },
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

export const unloadStakePool =
  (key: string): AppThunk =>
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.stakePool[key]) {
      dispatch(clearStakePoolByKey(key));
    }
    dispatch(subtractStakePoolUIManager(key));
  };
