import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { reduceMyNewUsername } from './reduceMyNewUsername';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';

export const reduceProfileSocket =
  (action: { type: string; target: string; payload: any }): AppThunk =>
  (dispatch, getState) => {
    const myPersonaCache = selectMyPersonaCache(getState());
    switch (action.type) {
      case 'newUsername':
        if (myPersonaCache.address === action.target) {
          dispatch(reduceMyNewUsername(action.payload));
        }
        break;
      default:
        handleError({ message: i18n.t('error:unknownSocketEvent') });
        break;
    }
  };
