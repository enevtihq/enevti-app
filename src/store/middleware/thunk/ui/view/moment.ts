import { handleError } from 'enevti-app/utils/error/handle';
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
} from 'enevti-app/store/slices/ui/view/moment';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getMoments, parseMomentCache } from 'enevti-app/service/enevti/moment';

type loadMomentsArgs = { reload: boolean };

export const loadMoments = createAsyncThunk<
  void,
  loadMomentsArgs,
  AsyncThunkAPI
>(
  'momentView/loadMoments',
  async ({ reload = false }, { dispatch, getState, signal }) => {
    try {
      const now = Date.now();
      dispatch(setMomentView(selectMomentItemsCache(getState())));

      if (
        reload ||
        now - selectLastFetchMomentCache(getState()) > lastFetchTimeout.moment
      ) {
        const moments = await getMoments(signal);
        if (moments) {
          dispatch(setMomentView(moments));
          dispatch(setLastFetchMomentCache(now));
          dispatch(setMomentItemsCache(parseMomentCache(moments)));
        }
      }

      dispatch(setMomentViewLoaded(true));
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadMoments = (): AppThunk => dispatch => {
  dispatch(resetMomentView());
};
