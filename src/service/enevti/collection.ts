import { COIN_NAME } from '../../components/atoms/brand/AppBrandConstant';
import { Collection } from '../../types/service/enevti/collection';
import { sleep } from './dummy';

async function fetchCollection(id: string): Promise<Collection | undefined> {
  await sleep(1000);
  console.log(id);
  return {
    id: Math.random().toString(),
    collectionType: 'onekind',
    name: 'Eye Collection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible',
    cover: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
    createdOn: 1648256392852,
    symbol: 'EYECL',
    like: 123,
    comment: 12,
    social: {
      twitter: {
        link: '',
        stat: 0,
      },
    },
    packSize: 1,
    stat: {
      total: 12,
      owner: 1,
      floor: {
        amount: '512134000',
        currency: COIN_NAME,
      },
      volume: {
        amount: '512134000',
        currency: COIN_NAME,
      },
    },
    available: [
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
    ],
    minted: [
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
      'wefdsfasdfwef',
    ],
    mintingExpire: 1648266392852,
    originAddress: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
    price: {
      amount: '512134000',
      currency: COIN_NAME,
    },
    activity: [
      {
        transaction: 'fgagergdfsdf',
        name: 'sale',
        serial: 12,
        date: 1648256592852,
        from: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
        to: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
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
): Promise<Collection | undefined> {
  return await fetchCollection(id);
}
