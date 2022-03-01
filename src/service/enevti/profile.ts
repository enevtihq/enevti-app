import { Profile } from '../../types/service/enevti/profile';
import { getDummyNFTData, sleep } from './dummy';

export async function getProfileCompleteData(
  address: string,
): Promise<Profile | undefined> {
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
