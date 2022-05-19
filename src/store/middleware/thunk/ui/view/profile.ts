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
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Persona } from 'enevti-app/types/core/account/persona';
import { Profile } from 'enevti-app/types/core/account/profile';
import { payManualDeliverSecret } from 'enevti-app/store/middleware/thunk/payment/creator/payDeliverSecret';
import {
  addProfileUIManager,
  selectUIManager,
  subtractProfileUIManager,
} from 'enevti-app/store/slices/ui/view/manager';

type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];
type LoadProfileArgs = { routeParam: ProfileRoute; reload: boolean; isMyProfile: boolean };

export const loadProfile = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadProfile',
  async ({ routeParam, reload, isMyProfile }, { dispatch, getState, signal }) => {
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
        const uiManager = selectUIManager(getState());
        if (!uiManager.profile[routeParam.arg]) {
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
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      if (isMyProfile) {
        dispatch(setMyProfileViewLoaded(true));
      } else {
        dispatch(setProfileViewLoaded({ key: routeParam.arg, value: true }));
        dispatch(addProfileUIManager(routeParam.arg));
      }
      reload && dispatch(hideModalLoader());
    }
  },
);

export const initProfile = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'home/initProfile',
  async (_, { dispatch, signal }) => {
    try {
      await getMyBasePersona(true, signal);
      const profileResponse = await getMyProfile(true, signal);
      if (profileResponse.data.pending > 0) {
        dispatch(payManualDeliverSecret() as unknown as AnyAction);
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadProfile =
  (routeParam: ProfileRoute, isMyProfile: boolean): AppThunk =>
  (dispatch, getState) => {
    if (isMyProfile) {
      dispatch(resetMyProfileView());
    } else {
      const uiManager = selectUIManager(getState());
      if (!uiManager.profile[routeParam.arg]) {
        dispatch(clearProfileByKey(routeParam.arg));
      }
      dispatch(subtractProfileUIManager(routeParam.arg));
    }
  };
