import { NFTBase } from '../../types/nft';
import {
  HomeFeedItemResponse,
  HomeFeedResponse,
  HomeMomentsResponse,
} from '../../types/service/homeFeedItem';
import { getDummyNFTData } from './dummy';

function getHomeFeedItemList(): HomeFeedItemResponse {
  let randomCount = Math.random() * 10;
  if (randomCount === 0) {
    randomCount = 1;
  }
  randomCount = 1;

  const randomNFT: NFTBase[] = [];
  for (let i = 0; i < randomCount; i++) {
    randomNFT.push(getDummyNFTData());
  }

  return {
    type: 'container',
    id: Math.random().toString(),
    like: 271,
    comment: 32,
    price: '9327',
    name: 'EyeCollection',
    description:
      'to celebrate our 2021 newest cat, we release new NFT collection withtons of utility that you can experience with your own eyes',
    promoted: true,
    owner: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
    username: '',
    photo: '',
    stake: '54212378',
    nft: randomNFT,
  };
}

export async function getHomeFeedList(): Promise<HomeFeedResponse | undefined> {
  let randomCount = Math.random() * 10;
  if (randomCount === 0) {
    randomCount = 1;
  }
  randomCount = 20;

  const randomFeed: HomeFeedResponse = [];
  for (let i = 0; i < randomCount; i++) {
    randomFeed.push(getHomeFeedItemList());
  }

  return randomFeed;
}

export async function getHomeMomentsList(): Promise<
  HomeMomentsResponse | undefined
> {
  let randomCount = Math.random() * 10;
  if (randomCount === 1) {
    randomCount = 0;
  }

  const randomMoments: HomeMomentsResponse = [];
  for (let i = 0; i < randomCount; i++) {
    randomMoments.push({
      id: Math.random().toString(),
      photo: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      username: '@aldhosutra',
    });
  }

  return randomMoments;
}
