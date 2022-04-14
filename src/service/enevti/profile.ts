import BigNumber from 'bignumber.js';
import { Profile } from 'enevti-app/types/service/enevti/profile';
import { store } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import { getDummyCollectionBaseDate, getDummyNFTData } from './dummy';
import {
  selectMyProfileCache,
  setLastFetchMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';
import { lastFetchTreshold } from 'enevti-app/utils/constant/lastFetch';
import { getMyAddress } from './persona';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;

async function fetchProfile(
  address: string,
  signal?: AbortController['signal'],
): Promise<Profile | undefined> {
  console.log(address);

  await sleep(1000, signal);

  const ownedNFT = [];
  const onsaleNFT = [];
  const collection: any[] = [];

  for (let i = 0; i < 10; i++) {
    ownedNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < 10; i++) {
    onsaleNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < 2; i++) {
    collection.push(getDummyCollectionBaseDate());
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
    collection: collection,
  };
}

function parseProfileCache(profile: Profile) {
  return profile;
}

export async function getProfile(
  address: string,
  signal?: AbortController['signal'],
): Promise<Profile | undefined> {
  return await fetchProfile(address, signal);
}

export async function getMyProfile(
  force: boolean = false,
  signal?: AbortController['signal'],
): Promise<Profile | undefined> {
  await sleep(1);
  const now = Date.now();
  const myAddress = await getMyAddress();
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch;
  let myProfile: Profile = selectMyProfileCache(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.profile) {
    const profileResponse = await getProfile(myAddress, signal);
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
