import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { reduceNewUsername } from './username/reduceNewUsername';
import { reduceBalanceChanged } from './balance/reduceBalanceChanged';
import { reduceTotalStakeChanged } from './totalStake/reduceTotalStakeChanged';

export const reduceProfileSocket =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  dispatch => {
    switch (action.type) {
      case 'usernameChanged':
        dispatch(reduceNewUsername(action, key));
        break;
      case 'balanceChanged':
        dispatch(reduceBalanceChanged(action, key));
        break;
      case 'totalStakeChanged':
        dispatch(reduceTotalStakeChanged(action, key));
        break;
      default:
        handleError({ message: i18n.t('error:unknownSocketEvent') });
        break;
    }
  };
