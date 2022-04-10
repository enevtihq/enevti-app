import { getBasePersona } from 'enevti-app/service/enevti/persona';
import { getMyProfile, getProfile } from 'enevti-app/service/enevti/profile';
import { handleError } from 'enevti-app/utils/error/handle';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  resetMyProfileView,
  setMyProfileView,
  setMyProfileViewLoaded,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  clearProfileByAddress,
  setProfileView,
  setProfileViewLoaded,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';

type LoadProfileArgs = { address: string; reload: boolean };

export const loadProfile = createAsyncThunk<
  void,
  LoadProfileArgs,
  AsyncThunkAPI
>(
  'profileView/loadProfile',
  async ({ address, reload }, { dispatch, getState, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const myPersona = selectMyPersonaCache(getState());
      if (address === myPersona.address) {
        const profileResponse = await getMyProfile(reload, signal);
        if (profileResponse) {
          dispatch(
            setMyProfileView({ ...profileResponse, persona: myPersona }),
          );
          dispatch(setMyProfileViewLoaded(true));
        }
      } else {
        const personaBase = await getBasePersona(address, signal);
        const profileResponse = await getProfile(address, signal);
        if (personaBase && profileResponse) {
          dispatch(
            setProfileView({ ...profileResponse, persona: personaBase }),
          );
          dispatch(setProfileViewLoaded({ address, value: true }));
        }
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadProfile =
  (address: string): AppThunk =>
  (dispatch, getState) => {
    const myPersona = selectMyPersonaCache(getState());
    if (address !== myPersona.address) {
      dispatch(clearProfileByAddress(address));
    } else {
      dispatch(resetMyProfileView());
    }
  };
