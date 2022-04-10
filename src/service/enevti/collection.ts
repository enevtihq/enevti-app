import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import { getDummyNFTData, sleep } from './dummy';

async function fetchCollection(
  id: string,
  signal?: AbortController['signal'],
): Promise<Collection | undefined> {
  await sleep(1000, signal);
  console.log('collection id:', id);
  const mintedNFT = [];

  for (let i = 0; i < 2; i++) {
    mintedNFT.push(getDummyNFTData());
  }

  return {
    id: id,
    collectionType: 'onekind',
    name: 'Eye Collection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible, we try to create something remarkable with eyes and your vision. Eyes symbolyze how we see something new on the world, so this collection also emphasize new vision for humanity and NFT world as a whole',
    cover: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
    createdOn: 1648256392852,
    symbol: 'EYECL',
    like: 123,
    comment: 12,
    social: {
      twitter: {
        link: 'https://twitter.com/aldhosutra',
        stat: 1120,
      },
    },
    packSize: 1,
    stat: {
      minted: 7,
      owner: 1,
      redeemed: 1,
      floor: {
        amount: '512432134000',
        currency: COIN_NAME,
      },
      volume: {
        amount: '512134000',
        currency: COIN_NAME,
      },
    },
    minting: {
      total: 12,
      available: 4,
      expire: 1648986392852,
      price: {
        amount: '512134000',
        currency: COIN_NAME,
      },
    },
    minted: mintedNFT,
    creator: {
      photo: '',
      address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      username: '',
    },
    activity: [
      {
        transaction: 'fgagergdfsdf',
        name: 'mint',
        nft: getDummyNFTData(),
        date: 1648256592852,
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: {
          amount: '512134000',
          currency: COIN_NAME,
        },
      },
      {
        transaction: 'fgagergdfsdf',
        name: 'mint',
        nft: getDummyNFTData(),
        date: 1648256592852,
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: {
          amount: '512134000',
          currency: COIN_NAME,
        },
      },
      {
        transaction: 'fgagergdfsdf',
        name: 'mint',
        nft: getDummyNFTData(),
        date: 1648256592852,
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: {
          amount: '512134000',
          currency: COIN_NAME,
        },
      },
    ],
  };
}

export async function getCollection(
  id: string,
  signal?: AbortController['signal'],
): Promise<Collection | undefined> {
  return await fetchCollection(id, signal);
}
