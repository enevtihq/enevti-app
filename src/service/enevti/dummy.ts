import { CollectionBase } from 'enevti-app/types/service/enevti/collection';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import { NFTBase } from 'enevti-app/types/nft/index';
import { NFTUtility } from 'enevti-app/types/nft/NFTUtility';
import { shuffleArray } from 'enevti-app/utils/primitive/array';
import { AbortError } from 'enevti-app/utils/error/type';

export const getDummyCollectionBaseDate = (): CollectionBase => {
  return {
    id: Math.random().toString(),
    cover: {
      cid: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      extension: 'jpg',
      mime: 'image/jpeg',
      size: 0,
    },
    name: 'EyeCollection',
    minting: {
      total: 12,
      available: 4,
      expire: 1658968392852,
      price: {
        amount: '512134000',
        currency: COIN_NAME,
      },
    },
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
  };
};

export const getDummyNFTData = (): NFTBase => {
  const utilityOption: NFTUtility[] = [
    'videocall',
    'chat',
    'content',
    'qr',
    'stream',
    'gift',
  ];

  return {
    id: Math.random().toString(),
    like: 10,
    symbol: 'EYECL',
    serial: '1A',
    name: 'EyeCollection',
    price: {
      amount: '14328123432',
      currency: COIN_NAME,
    },
    onSale: shuffleArray([true, false]),
    data: {
      cid: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      mime: 'image/jpeg',
      extension: 'jpg',
      size: -1,
    },
    NFTType: 'onekind',
    utility: utilityOption[Math.floor(Math.random() * utilityOption.length)],
    rarity: {
      stat: {
        rank: 12,
        percent: 4,
      },
      trait: [
        {
          key: 'utility',
          value: 'videocall',
        },
      ],
    },
    partition: {
      parts: [
        'wfvfasdfwfwrgegwrhjtjut',
        'wfvfasdfwfwrgegwrhjtjut',
        'wfvfasdfwfwrgegwrhjtjut',
        'wfvfasdfwfwrgegwrhjtjut',
      ],
      upgradeMaterial: 4,
    },
    template: enevtiNFTTemplate,
  };
};

export async function sleep(time: number, signal?: AbortController['signal']) {
  await new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      return reject(AbortError);
    }
    const timeout = setTimeout(resolve, time);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(AbortError);
    });
  });
}
