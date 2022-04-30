import { AppThunk } from 'enevti-app/store/state';
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { reduceNewUsername } from './username/reduceNewUsername';
import { reduceBalancePlus } from './balance/reduceBalancePlus';
import { reduceBalanceMinus } from './balance/reduceBalanceMinus';
import { reduceTotalStakePlus } from './totalStake/reduceTotalStakePlus';
import { reduceTotalStakeMinus } from './totalStake/reduceTotalStakeMinus';

export const reduceProfileSocket =
  (action: { type: string; target: string; payload: any }, key?: string): AppThunk =>
  dispatch => {
    switch (action.type) {
      case 'newUsername':
        dispatch(reduceNewUsername(action, key));
        break;
      case 'balancePlus':
        dispatch(reduceBalancePlus(action, key));
        break;
      case 'balanceMinus':
        dispatch(reduceBalanceMinus(action, key));
        break;
      case 'totalStakePlus':
        dispatch(reduceTotalStakePlus(action, key));
        break;
      case 'totalStakeMinus':
        dispatch(reduceTotalStakeMinus(action, key));
        break;
      default:
        handleError({ message: i18n.t('error:unknownSocketEvent') });
        break;
    }
  };
