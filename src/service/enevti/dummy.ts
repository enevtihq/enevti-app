import { CollectionBase } from 'enevti-app/types/service/enevti/collection';
import { COIN_NAME } from '../../components/atoms/brand/AppBrandConstant';
import enevtiNFTTemplate from '../../components/atoms/nft/template/enevtiNFTTemplate';
import { NFTBase } from '../../types/nft/index';
import { NFTUtility } from '../../types/nft/NFTUtility';
import { shuffleArray } from '../../utils/primitive/array';

export const getDummyCollectionBaseDate = (): CollectionBase => {
  return {
    id: Math.random().toString(),
    cover: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
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
    data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
    dataMime: 'image/jpeg',
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
    redeem: {
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

export async function sleep(time: number) {
  await new Promise(r => setTimeout(r, time));
}
