import { ProfileResponse } from '../../types/service/enevti/profile';
import { getDummyNFTData, sleep } from './dummy';

async function getProfileNFT() {
  await sleep(5000);

  const ownedNFT = [];
  const onsaleNFT = [];
  const mintedContainer: any[] = [];

  for (let i = 0; i < Math.random() * 10 + 1; i++) {
    ownedNFT.push(getDummyNFTData());
  }

  for (let i = 0; i < Math.random() * 10 + 1; i++) {
    onsaleNFT.push(getDummyNFTData());
  }

  return {
    owned: ownedNFT,
    onsale: onsaleNFT,
    minted: mintedContainer,
  };
}

export async function getProfileCompleteData(
  address: string,
): Promise<ProfileResponse | undefined> {
  console.log(address);

  return await getProfileNFT();
}
