import { getBasePersona } from 'enevti-app/service/enevti/persona';
import { getMyProfile, getProfile } from 'enevti-app/service/enevti/profile';
import { handleError } from 'enevti-app/utils/error/handle';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  setMyPersonaView,
  setMyProfileView,
  setMyProfileViewLoaded,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  resetProfileView,
  setPersonaView,
  setProfileView,
  setProfileViewLoaded,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk } from 'enevti-app/store/state';

export const loadProfile =
  (address: string, reload: boolean): AppThunk =>
  async (dispatch, getState) => {
    dispatch({ type: 'profileView/loadProfile' });
    try {
      reload && dispatch(showModalLoader());
      const myPersona = selectMyPersonaCache(getState());
      if (address === myPersona.address) {
        const profileResponse = await getMyProfile(reload);
        if (profileResponse) {
          dispatch(setMyProfileViewLoaded(true));
          dispatch(setMyProfileView(profileResponse));
          dispatch(setMyPersonaView(myPersona));
        }
      } else {
        const personaBase = await getBasePersona(address);
        const profileResponse = await getProfile(address);
        if (personaBase && profileResponse) {
          dispatch(setProfileViewLoaded(true));
          dispatch(setProfileView(profileResponse));
          dispatch(setPersonaView(personaBase));
        }
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  };

export const unloadProfile =
  (address: string): AppThunk =>
  (dispatch, getState) => {
    const myPersona = selectMyPersonaCache(getState());
    if (address !== myPersona.address) {
      dispatch(resetProfileView());
    }
  };
