import { Profile } from '../../types/service/enevti/profile';
import { store } from '../../store/state';
import { getDummyNFTData, sleep } from './dummy';
import {
  selectProfile,
  setLastFetchProfile,
  setProfile,
} from '../../store/slices/entities/profile';
import { lastFetchTreshold } from '../../utils/lastFetch/constant';

async function fetchMyProfile(address: string): Promise<Profile | undefined> {
  console.log(address);

  await sleep(5000);

  const ownedNFT = [];
  const onsaleNFT = [];
  const mintedContainer: any[] = [];

  for (let i = 0; i < 50; i++) {
    ownedNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < 50; i++) {
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

export async function getProfileCompleteData(
  address: string,
  force: boolean = false,
): Promise<Profile | undefined> {
  const now = Date.now();
  const lastFetch = selectProfile(store.getState()).lastFetch;
  let myProfile: Profile = selectProfile(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.profile) {
    const profileResponse = await fetchMyProfile(address);
    if (profileResponse) {
      myProfile = profileResponse;
      store.dispatch(setLastFetchProfile(now));
      store.dispatch(setProfile(myProfile));
    }
  }

  return myProfile;
}
