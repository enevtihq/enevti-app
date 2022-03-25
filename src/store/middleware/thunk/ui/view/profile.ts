import { getBasePersona } from '../../../../../service/enevti/persona';
import {
  getMyProfile,
  getProfile,
} from '../../../../../service/enevti/profile';
import { handleError } from '../../../../../utils/error/handle';
import { selectMyPersonaCache } from '../../../../slices/entities/cache/myPersona';
import {
  hideModalLoader,
  showModalLoader,
} from '../../../../slices/ui/global/modalLoader';
import {
  setMyPersonaView,
  setMyProfileView,
} from '../../../../slices/ui/view/myProfile';
import {
  resetProfileView,
  setPersonaView,
  setProfileView,
} from '../../../../slices/ui/view/profile';
import { AppThunk } from '../../../../state';

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
          dispatch(setMyProfileView(profileResponse));
          dispatch(setMyPersonaView(myPersona));
        }
      } else {
        const personaBase = await getBasePersona(address);
        const profileResponse = await getProfile(address);
        if (personaBase && profileResponse) {
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
