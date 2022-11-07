import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStakePoolDataByRouteParam, getStakePoolStaker } from 'enevti-app/service/enevti/stake';
import {
  clearStakePoolByKey,
  setStakePoolLoaded,
  setStakePoolView,
  selectStakePoolView,
  pushStakePoolStaker,
  stakePoolInitialStateItem,
} from 'enevti-app/store/slices/ui/view/stakePool';
import { STAKER_INITIAL_LENGTH, STAKER_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route'];
type loadStakePoolArgs = { route: StakePoolRoute; reload: boolean };

export const loadStakePool = createAsyncThunk<void, loadStakePoolArgs, AsyncThunkAPI>(
  'stakePoolView/loadStakePool',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const now = Date.now();
      const stakePoolResponse = await getStakePoolDataByRouteParam(route.params, true, signal);
      dispatch(
        setStakePoolView({
          key: route.key,
          value: {
            ...stakePoolInitialStateItem,
            ...stakePoolResponse.data,
            version: now,
            stakerPagination: { checkpoint: STAKER_INITIAL_LENGTH, version: stakePoolResponse.version.stakePool },
            reqStatus: stakePoolResponse.status,
            loaded: true,
          },
        }),
      );
    } catch (err: any) {
      handleError(err);
      dispatch(setStakePoolLoaded({ key: route.key, value: true }));
    } finally {
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
      if (stakePoolView.staker.length !== version) {
        const stakerResponse = await getStakePoolStaker(
          stakePoolView.owner.address,
          offset,
          STAKER_RESPONSE_LIMIT,
          version,
          signal,
        );
        dispatch(
          pushStakePoolStaker({
            key: route.key,
            value: stakerResponse.data.data,
            pagination: { checkpoint: stakerResponse.data.checkpoint, version: stakerResponse.data.version },
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
