import { getBasePersonaByRouteParam, getMyBasePersona } from 'enevti-app/service/enevti/persona';
import { getMyProfile, getProfile } from 'enevti-app/service/enevti/profile';
import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  resetMyProfileView,
  setMyProfileView,
  setMyProfileViewLoaded,
  setMyProfileViewReqStatus,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  clearProfileByKey,
  initProfileView,
  setProfileView,
  setProfileViewLoaded,
  setProfileViewReqStatus,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Persona } from 'enevti-app/types/core/account/persona';
import { Profile } from 'enevti-app/types/core/account/profile';

type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];
type LoadProfileArgs = { routeParam: ProfileRoute; reload: boolean; isMyProfile: boolean };

export const loadProfile = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadProfile',
  async ({ routeParam, reload, isMyProfile }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      if (isMyProfile) {
        const personaResponse = await getMyBasePersona(reload, signal);
        const profileResponse = await getMyProfile(reload, signal);
        dispatch(
          setMyProfileView({
            ...(profileResponse.data as Profile),
            persona: personaResponse.data as Persona,
            version: Date.now(),
          }),
        );
        dispatch(setMyProfileViewReqStatus(profileResponse.status));
      } else {
        dispatch(initProfileView(routeParam.arg));
        const personaBase = await getBasePersonaByRouteParam(routeParam, signal);
        if (personaBase.status === 200 && !isErrorResponse(personaBase)) {
          const profileResponse = await getProfile(personaBase.data.address, signal);
          if (profileResponse.status === 200 && !isErrorResponse(profileResponse)) {
            dispatch(
              setProfileView({
                key: routeParam.arg,
                value: { ...profileResponse.data, persona: personaBase.data, version: Date.now() },
              }),
            );
          }
        }
        dispatch(setProfileViewReqStatus({ key: routeParam.arg, value: personaBase.status }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      if (isMyProfile) {
        dispatch(setMyProfileViewLoaded(true));
      } else {
        dispatch(setProfileViewLoaded({ key: routeParam.arg, value: true }));
      }
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadProfile =
  (routeParam: ProfileRoute, isMyProfile: boolean): AppThunk =>
  dispatch => {
    if (isMyProfile) {
      dispatch(resetMyProfileView());
    } else {
      dispatch(clearProfileByKey(routeParam.arg));
    }
  };
