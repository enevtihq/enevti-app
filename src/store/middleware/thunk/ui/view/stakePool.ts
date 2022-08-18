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
import { STAKER_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route'];
type loadStakePoolArgs = { route: StakePoolRoute; reload: boolean };

export const loadStakePool = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadStakePool',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const now = Date.now();
      const stakePoolResponse = await getStakePoolDataByRouteParam(route.params, signal);
      const staker = await getStakePoolInitialStaker(stakePoolResponse.data.owner.address, signal);
      dispatch(initStakePoolView(route.key));
      dispatch(
        setStakePoolView({
          key: route.key,
          value: { ...stakePoolResponse.data, staker: staker.data.data, version: now },
        }),
      );
      dispatch(
        setStakePoolStakerPagination({
          key: route.key,
          value: { checkpoint: staker.data.checkpoint, version: staker.data.version },
        }),
      );
      dispatch(setStakePoolReqStatus({ key: route.key, value: stakePoolResponse.status }));
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setStakePoolLoaded({ key: route.key, value: true }));
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreStaker = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadMoreStaker',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const stakePoolView = selectStakePoolView(getState(), route.key);
      const offset = stakePoolView.stakerPagination.checkpoint;
      const version = stakePoolView.stakerPagination.version;
      if (stakePoolView.staker.length - 1 !== version) {
        const stakerResponse = await getStakePoolStaker(
          stakePoolView.owner.address,
          offset,
          STAKER_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(pushStakePoolStaker({ key: route.key, value: stakerResponse.data.data }));
        dispatch(
          setStakePoolStakerPagination({
            key: route.key,
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
  (route: StakePoolRoute): AppThunk =>
  dispatch => {
    dispatch(clearStakePoolByKey(route.key));
  };
