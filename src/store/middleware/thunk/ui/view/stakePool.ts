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
} from 'enevti-app/store/slices/ui/view/stakePool';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];
type loadStakePoolArgs = { routeParam: StakePoolRoute; reload: boolean };

export const loadStakePool = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadStakePool',
  async ({ routeParam, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const stakePoolResponse = await getStakePoolDataByRouteParam(routeParam, signal);
      if (stakePoolResponse.status === 200 && stakePoolResponse.data) {
        dispatch(setStakePoolView({ key: routeParam.arg, value: stakePoolResponse.data }));
      }
      dispatch(setStakePoolLoaded({ key: routeParam.arg, value: true }));
      dispatch(setStakePoolReqStatus({ key: routeParam.arg, value: stakePoolResponse.status }));
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadStakePool =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearStakePoolByKey(key));
  };
