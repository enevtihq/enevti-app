import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { reduceStakerUpdates } from './reduceStakerUpdates';

export const reduceStakePoolSocket =
  (action: { type: string; target: string; payload: any }, key: string): AppThunk =>
  dispatch => {
    switch (action.type) {
      case 'stakerUpdates':
        dispatch(reduceStakerUpdates(action, key));
        break;
      default:
        handleError({ message: i18n.t('error:unknownSocketEvent') });
        break;
    }
  };
