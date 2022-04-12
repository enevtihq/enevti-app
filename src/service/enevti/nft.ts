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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const utilityOption: NFTUtility[] = [
    'videocall',
    'chat',
    'content',
    'qr',
    'stream',
    'gift',
  ];

  return {
    id: id,
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
      base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
      username: '',
    },
    creator: {
      photo: '',
      base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
      extension: 'jpg',
      size: -1,
    },
    NFTType: 'onekind',
    utility: 'content',
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
        cipher:
          'eyJlbmNyeXB0ZWRNZXNzYWdlIjoiMmZiZmY2MDAyMTc5MDE1ODk5YTVjMWJkMzBjYTBjODUzOTI1ODZkYjYyNzBmMTYzMzEzYWZkMWNmNzY1MWE3Y2VhZjFhNTYyOGE5ZjJjYTJhN2E1YzhlMDE5MTI0YzkyYmVjNGRiYzBiOTk0YjBhNjgzMmYxZTg3MTc0NDk4MGFlODRkY2EyZDE4YTg1NTE2MDE4YTVjYTc3ZGE1ZWI2OGIwNjkyYmEzMmRhNjFkZTA3OTNjYTFhNjg1YjhmOWU0Yzc5MTE4OGE2ZGNlZmZhYzY1NTM1MzU3Y2IzMjQ0NGU0Y2RkYWY4ZDQ5YmU2YjE5ZDg0ZTJkYmYwYzgxMzk3ZTgxODkxYmVmZTk4MThjZTg3ODAyOTdkYTA1OGYyYmMyMTkwYjM0ZTk2MDM3MWRhZjNhZGU4ZWNjMGJhM2JiNDU2OTIzNmY4MzdiZjk4ODI5M2E4MmQxNjc0MzMyMWQ2NmVlNDViZmE2ZjUzZWNiZjQ5MzlhYTRkZDRkZjRiNjM4MGYyN2ZmNzkwYmFjOWUzNjZhNmEwZGMzY2MzYWNhYjZjNzIwMTZjOWUyNTIxZTA2OWY1OGUxMzczM2Y3OGZmOWFjNDQxYTg2ZmQyNWY2NDhjYTE2M2ZmMDQwY2UwZjY3N2Q1ODc3NTgzYWMwYzdjYzRjN2NhYjMzNWRkOGI2MjgxN2IzYzU4NTkyMzJhYWUxYzVlYTI4MWJhYTZlNDBhZCIsIm5vbmNlIjoiNTdkMmFlOTRiMjQ1ZGQ0Y2E1MjY3MjQxYTk2MWMzZDNlOGY4Mjc2YWQyYTM2NDY5In0=',
        signature:
          '6c691c2139f32017e6fbe81ce849e728838dec3ffa24f0417dce617aa8fa66d2fe2f115bb9f11cf321553ce4a60e751157dc941800c473c77feec7a70f8ef805',
        sender:
          '44fc724f611d822fbb946e4084d27cc07197bb3ab4d0406a17ade813cd7aee15',
        recipient:
          '0383eb71af2c6d201b3fdfcb324cc11ee79514465a559d6da3ac5f038397ae80',
      },
      content: {
        cid: 'QmYanPVeUCBKfxXGcTBCjS8HjYLuf3qscqGV1peF5iszkC',
        mime: 'audio/mpeg',
        extension: 'mp3',
        size: 3548243,
        iv: '5899c28e12159a2b65c097054a58c0c3',
        salt: '9136de3e95f38b5207be8ef9d8fd322a',
      },
      schedule: {
        recurring: 'yearly',
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
        timezoneOffset: -420,
      },
    },
    activity: [
      {
        transaction: 'veavaefasdfff',
        name: 'sale',
        to: {
          photo: '',
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
