import BigNumber from 'bignumber.js';
import { Profile } from '../../types/service/enevti/profile';
import { store } from '../../store/state';
import { getDummyNFTData, sleep } from './dummy';
import {
  selectMyProfile,
  setLastFetchMyProfile,
  setMyProfile,
} from '../../store/slices/entities/myProfile';
import { lastFetchTreshold } from '../../utils/constant/lastFetch';
import { getMyAddress } from './persona';
import { completeTokenUnit } from '../../utils/format/amount';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;

async function fetchProfile(address: string): Promise<Profile | undefined> {
  console.log(address);

  await sleep(5000);

  const ownedNFT = [];
  const onsaleNFT = [];
  const mintedContainer: any[] = [];

  for (let i = 0; i < 30; i++) {
    ownedNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < 30; i++) {
    onsaleNFT.push(getDummyNFTData());
  }

  return {
    nftSold: 1500,
    treasuryAct: 54,
    serveRate: 0.98,
    stake: '132400000000',
    balance: '15400000000',
    twitter: {
      username: '@aldhosutra',
      follower: 1120,
    },
    owned: ownedNFT,
    onsale: onsaleNFT,
    minted: mintedContainer,
  };
}

export async function getProfile(
  address: string,
  force: boolean = false,
): Promise<Profile | undefined> {
  const now = Date.now();
  const lastFetch = selectMyProfile(store.getState()).lastFetch;
  let myProfile: Profile = selectMyProfile(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.profile) {
    const profileResponse = await fetchProfile(address);
    if (profileResponse) {
      myProfile = profileResponse;
      store.dispatch(setLastFetchMyProfile(now));
      store.dispatch(setMyProfile(myProfile));
    }
  }

  return myProfile;
}

export async function getMyProfile(force: boolean = false) {
  const myAddress = await getMyAddress();
  return await getProfile(myAddress, force);
}

export function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gt(
    completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY),
  );
}
