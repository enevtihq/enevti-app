import { getBasePersonaByRouteParam, getMyBasePersona } from 'enevti-app/service/enevti/persona';
import { getMyProfile, getProfile } from 'enevti-app/service/enevti/profile';
import { handleError } from 'enevti-app/utils/error/handle';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  resetMyProfileView,
  setMyProfileView,
  setMyProfileViewLoaded,
  setMyProfileViewReqStatus,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  clearProfileByKey,
  setProfileView,
  setProfileViewLoaded,
  setProfileViewReqStatus,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Persona } from 'enevti-app/types/core/account/persona';

type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];
type LoadProfileArgs = { routeParam: ProfileRoute; reload: boolean };

const defaultArgType = 'address';

export const loadProfile = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadProfile',
  async ({ routeParam, reload }, { dispatch, getState, signal }) => {
    try {
      const myPersona = selectMyPersonaCache(getState());
      const argType: keyof Persona | undefined =
        routeParam.mode === 'a'
          ? 'address'
          : routeParam.mode === 'b'
          ? 'base32'
          : routeParam.mode === 'u'
          ? 'username'
          : defaultArgType;
      reload && dispatch(showModalLoader());
      if (routeParam.arg === myPersona[argType]) {
        const personaResponse = await getMyBasePersona(reload, signal);
        const profileResponse = await getMyProfile(reload, signal);
        if (
          personaResponse.status === 200 &&
          personaResponse.data !== undefined &&
          profileResponse.status === 200 &&
          profileResponse.data !== undefined
        ) {
          dispatch(setMyProfileView({ ...profileResponse.data, persona: personaResponse.data }));
        }
        dispatch(setMyProfileViewLoaded(true));
        dispatch(setMyProfileViewReqStatus(profileResponse.status));
      } else {
        const personaBase = await getBasePersonaByRouteParam(routeParam, signal);
        if (personaBase.status === 200 && personaBase.data) {
          const profileResponse = await getProfile(personaBase.data.address, signal);
          if (profileResponse.status === 200 && profileResponse.data) {
            dispatch(
              setProfileView({
                key: routeParam.arg,
                value: { ...profileResponse.data, persona: personaBase.data },
              }),
            );
          }
        }
        dispatch(setProfileViewLoaded({ key: routeParam.arg, value: true }));
        dispatch(setProfileViewReqStatus({ key: routeParam.arg, value: personaBase.status }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadProfile =
  (routeParam: ProfileRoute): AppThunk =>
  (dispatch, getState) => {
    const myPersona = selectMyPersonaCache(getState());
    const argType: keyof Persona | undefined =
      routeParam.mode === 'a'
        ? 'address'
        : routeParam.mode === 'b'
        ? 'base32'
        : routeParam.mode === 'u'
        ? 'username'
        : defaultArgType;
    if (routeParam.arg === myPersona[argType]) {
      dispatch(resetMyProfileView());
    } else {
      dispatch(clearProfileByKey(routeParam.arg));
    }
  };
