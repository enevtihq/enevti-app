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
  resetPersonaView,
  setPersonaView,
} from '../../../../slices/ui/view/persona';
import {
  resetProfileView,
  setProfileView,
} from '../../../../slices/ui/view/profile';
import { AppThunk } from '../../../../state';

export const loadProfile =
  (address: string, force = false): AppThunk =>
  async (dispatch, getState) => {
    dispatch({ type: 'profileView/loadProfile' });
    try {
      dispatch(showModalLoader());
      const myPersona = selectMyPersonaCache(getState());
      if (address === myPersona.address) {
        const profileResponse = await getMyProfile(force);
        if (profileResponse) {
          dispatch(setProfileView(profileResponse));
          dispatch(setPersonaView(myPersona));
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
      dispatch(hideModalLoader());
    }
  };

export const unloadProfile = (): AppThunk => dispatch => {
  dispatch(resetPersonaView());
  dispatch(resetProfileView());
};
