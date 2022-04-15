import {
  Collection,
  CollectionBase,
} from 'enevti-app/types/service/enevti/collection';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import { NFT, NFTBase } from 'enevti-app/types/nft/index';
import { NFTUtility } from 'enevti-app/types/nft/NFTUtility';
import { shuffleArray } from 'enevti-app/utils/primitive/array';

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

export const getDummyCollectionFullData = (): Collection => {
  const mintedNFT = [];

  for (let i = 0; i < 2; i++) {
    mintedNFT.push(getDummyNFTData());
  }

  return {
    id: Math.random().toString(),
    collectionType: 'onekind',
    name: 'Eye Collection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible, we try to create something remarkable with eyes and your vision. Eyes symbolyze how we see something new on the world, so this collection also emphasize new vision for humanity and NFT world as a whole',
    cover: {
      cid: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
      mime: 'image/jpeg',
      extension: 'jpg',
      size: 0,
    },
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
      expire: 1658986392852,
      price: {
        amount: '512134000',
        currency: COIN_NAME,
      },
    },
    minted: mintedNFT,
    creator: {
      photo: '',
      base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
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
          base32: 'lsk7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
          username: '',
        },
        value: {
          amount: '512134000',
          currency: COIN_NAME,
        },
      },
    ],
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

export const getDummyNFTFullData = (): NFT => {
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
      base32: 'lsknqmbhhusk3dh22bnkwfsmysqv7b5zvdytgo5ej',
      address: '3d4a6ef61ba235dc60c7a5fdb2c775138cb00b51',
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
    utility: 'videocall',
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
        version: 1,
      },
      schedule: {
        recurring: 'once',
        time: {
          day: -1,
          date: 16,
          month: 3,
          year: 2022,
        },
        from: {
          hour: 14,
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
};
