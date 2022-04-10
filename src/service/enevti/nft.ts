import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError } from 'enevti-app/utils/error/handle';
import { NFT } from 'enevti-app/types/nft';
import { NFTUtility } from 'enevti-app/types/nft/NFTUtility';

import { sleep } from './dummy';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { shuffleArray } from 'enevti-app/utils/primitive/array';

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
}

export async function isNameAvailable(
  name: string,
  signal?: AbortController['signal'],
): Promise<boolean> {
  await sleep(1000, signal);
  console.log(name);
  return true;
}

export async function isSymbolAvailable(
  name: string,
  signal?: AbortController['signal'],
): Promise<boolean> {
  await sleep(1000, signal);
  console.log(name);
  return true;
}

async function fetchNFT(
  id: string,
  signal?: AbortController['signal'],
): Promise<NFT | undefined> {
  await sleep(1000, signal);
  console.log('collection id:', id);

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
    collectionId: Math.random().toString(),
    like: 10,
    comment: 3,
    createdOn: 1649172800701,
    chain: COIN_NAME,
    symbol: 'EYECL',
    serial: '1A',
    name: 'EyeCollection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible, we try to create something remarkable with eyes and your vision. Eyes symbolyze how we see something new on the world, so this collection also emphasize new vision for humanity and NFT world as a whole',
    owner: {
      photo: '',
      address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      username: '',
    },
    creator: {
      photo: '',
      address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      username: '',
    },
    price: {
      amount: '14328123432',
      currency: COIN_NAME,
    },
    onSale: shuffleArray([true, false]),
    data: {
      cid: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      mime: 'image/jpeg',
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
    redeem: {
      status: 'ready',
      count: 2,
      limit: 5,
      touched: 1649172800701,
      secret: {
        cipher: '',
        nonce: '',
        signature: '',
        signer: '',
      },
      content: {
        cid: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
        mime: 'image/jpeg',
        size: -1,
        iv: '',
        salt: '',
      },
      schedule: {
        recurring: 'every-year',
        time: {
          day: -1,
          date: 5,
          month: 3,
          year: -1,
        },
        from: {
          hour: 10,
          minute: 0,
        },
        until: 3600000,
      },
    },
    activity: [
      {
        transaction: 'veavaefasdfff',
        name: 'sale',
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: { amount: '2535623412', currency: COIN_NAME },
        date: 1649172800701,
      },
      {
        transaction: 'vewe34avaefaff',
        name: 'sale',
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: { amount: '2535623412', currency: COIN_NAME },
        date: 1649172800701,
      },
      {
        transaction: 'veavaefaff',
        name: 'sale',
        to: {
          photo: '',
          address: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          username: '',
        },
        value: { amount: '2535623412', currency: COIN_NAME },
        date: 1649172800701,
      },
    ],
    royalty: {
      creator: 10,
      staker: 5,
    },
  };
}

export async function getNFT(
  id: string,
  signal?: AbortController['signal'],
): Promise<NFT | undefined> {
  return await fetchNFT(id, signal);
}
