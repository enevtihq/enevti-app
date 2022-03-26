import BigNumber from 'bignumber.js';
import { Profile } from '../../types/service/enevti/profile';
import { store } from '../../store/state';
import { getDummyNFTData, sleep } from './dummy';
import {
  selectMyProfileCache,
  setLastFetchMyProfileCache,
  setMyProfileCache,
} from '../../store/slices/entities/cache/myProfile';
import { lastFetchTreshold } from '../../utils/constant/lastFetch';
import { getMyAddress } from './persona';
import { completeTokenUnit } from '../../utils/format/amount';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;

async function fetchProfile(address: string): Promise<Profile | undefined> {
  console.log(address);

  await sleep(1000);

  const ownedNFT = [];
  const onsaleNFT = [];
  const mintedContainer: any[] = [];

  for (let i = 0; i < 10; i++) {
    ownedNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < 10; i++) {
    onsaleNFT.push(getDummyNFTData());
  }

  return {
    nftSold: 1500,
    treasuryAct: 54,
    serveRate: 0.98,
    stake: '132400000000',
    balance: '15400000000',
    social: {
      twitter: {
        link: 'https://twitter.com/aldhosutra',
        stat: 1120,
      },
    },
    owned: ownedNFT,
    onsale: onsaleNFT,
    minted: mintedContainer,
  };
}

function parseProfileCache(profile: Profile) {
  return profile;
}

export async function getProfile(
  address: string,
): Promise<Profile | undefined> {
  return await fetchProfile(address);
}

export async function getMyProfile(
  force: boolean = false,
): Promise<Profile | undefined> {
  const now = Date.now();
  const myAddress = await getMyAddress();
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch;
  let myProfile: Profile = selectMyProfileCache(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.profile) {
    const profileResponse = await getProfile(myAddress);
    if (profileResponse) {
      myProfile = profileResponse;
      store.dispatch(setLastFetchMyProfileCache(now));
      store.dispatch(setMyProfileCache(parseProfileCache(myProfile)));
    }
  }

  return myProfile;
}

export function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gt(
    completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY),
  );
}
