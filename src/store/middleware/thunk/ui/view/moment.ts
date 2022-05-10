import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  selectMomentItemsCache,
  selectLastFetchMomentCache,
  setMomentItemsCache,
  setLastFetchMomentCache,
} from 'enevti-app/store/slices/entities/cache/moment';
import {
  resetMomentView,
  setMomentView,
  setMomentViewLoaded,
  setMomentViewReqStatus,
  setMomentViewVersion,
} from 'enevti-app/store/slices/ui/view/moment';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getMoments, parseMomentCache } from 'enevti-app/service/enevti/moment';

type loadMomentsArgs = { reload: boolean };

export const loadMoments = createAsyncThunk<void, loadMomentsArgs, AsyncThunkAPI>(
  'momentView/loadMoments',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setMomentViewVersion(now));
      dispatch(setMomentView(selectMomentItemsCache(getState())));
      dispatch(setMomentViewReqStatus(200));

      if (reload || now - selectLastFetchMomentCache(getState()) > lastFetchTimeout.moment) {
        const momentsResponse = await getMoments(signal);
        if (momentsResponse.status === 200 && !isErrorResponse(momentsResponse)) {
          dispatch(setLastFetchMomentCache(now));
          dispatch(setMomentItemsCache(parseMomentCache(momentsResponse.data)));
        }
        dispatch(setMomentView(momentsResponse.data));
        dispatch(setMomentViewReqStatus(momentsResponse.status));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setMomentViewLoaded(true));
    }
  },
);

export const unloadMoments = (): AppThunk => dispatch => {
  dispatch(resetMomentView());
};
