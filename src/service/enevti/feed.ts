import { NFTBase } from '../../types/nft';
import { FeedItem, Feeds, Moments } from '../../types/service/enevti/feed';
import { getDummyNFTData, sleep } from './dummy';

function getFeedItemList(): FeedItem {
  let randomCount = Math.random() * 10;
  if (randomCount === 0) {
    randomCount = 1;
  }

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
    stake: '542123',
    delegate: false,
    nft: randomNFT,
  };
}

export async function getFeedList(): Promise<Feeds | undefined> {
  await sleep(1000);

  let randomCount = Math.random() * 10;
  if (randomCount === 0) {
    randomCount = 1;
  }
  randomCount = 20;

  const randomFeed: Feeds = [];
  for (let i = 0; i < randomCount; i++) {
    randomFeed.push(getFeedItemList());
  }

  return randomFeed;
}

export async function getMomentsList(): Promise<Moments | undefined> {
  await sleep(1000);

  let randomCount = Math.random() * 10;
  if (randomCount === 1) {
    randomCount = 0;
  }

  const randomMoments: Moments = [];
  for (let i = 0; i < randomCount; i++) {
    randomMoments.push({
      id: Math.random().toString(),
      photo: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      username: '@aldhosutra',
    });
  }

  return randomMoments;
}
