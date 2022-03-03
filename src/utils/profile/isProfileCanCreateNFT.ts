import { Profile } from '../../types/service/enevti/profile';
import BigNumber from 'bignumber.js';
import { completeTokenUnit } from '../format/amount';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;

export default function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gt(
    completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY),
  );
}
