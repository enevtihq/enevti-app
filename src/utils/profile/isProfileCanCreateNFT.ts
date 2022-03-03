import { Profile } from '../../types/service/enevti/profile';
import BigNumber from 'bignumber.js';
import { completeTokenUnit } from '../format/amount';

export default function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gt(completeTokenUnit(1000));
}
