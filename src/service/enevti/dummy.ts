import { Collection, CollectionBase } from 'enevti-app/types/core/chain/collection';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import { NFT, NFTBase } from 'enevti-app/types/core/chain/nft/index';
import { NFTUtility } from 'enevti-app/types/core/chain/nft/NFTUtility';
import { shuffleArray } from 'enevti-app/utils/primitive/array';
import { StakePoolData } from 'enevti-app/types/core/chain/stake';
import { FeedItem, MomentItem } from 'enevti-app/types/core/service/feed';

export const getDummyMomentItem = (): MomentItem => {
  return {
    id: Math.random().toString(),
    photo: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
    username: '@aldhosutra',
  };
};

export const getDummyFeedItem = (): FeedItem => {
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
    price: {
      amount: '9327',
      currency: COIN_NAME,
    },
    name: 'EyeCollection',
    description:
      'to celebrate our 2021 newest cat, we release new NFT collection withtons of utility that you can experience with your own eyes',
    promoted: true,
    owner: {
      username: '',
      base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
      photo: '',
    },
    stake: '542123',
    delegate: false,
    nft: randomNFT,
  };
};

export const getDummyCollectionBaseDate = (): CollectionBase => {
  return {
    id: Math.random().toString(),
    cover: {
      cid: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
      extension: 'jpg',
      mime: 'image/jpeg',
      size: 0,
      protocol: 'ipfs',
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
    mintingType: 'coin',
    promoted: false,
    name: 'Eye Collection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible, we try to create something remarkable with eyes and your vision. Eyes symbolyze how we see something new on the world, so this collection also emphasize new vision for humanity and NFT world as a whole',
    cover: {
      cid: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
      mime: 'image/jpeg',
      extension: 'jpg',
      size: 0,
      protocol: 'ipfs',
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
      base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
      username: '',
    },
    activity: [
      {
        transaction: 'fgagergdfsdf',
        name: 'minted',
        nfts: [getDummyNFTData()],
        date: 1648256592852,
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
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
        name: 'minted',
        nfts: [getDummyNFTData()],
        date: 1648256592852,
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
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
        name: 'minted',
        nfts: [getDummyNFTData()],
        date: 1648256592852,
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
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
  const utilityOption: NFTUtility[] = ['videocall', 'chat', 'content', 'qr', 'stream', 'gift'];

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
      cid: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
      mime: 'image/jpeg',
      extension: 'jpg',
      size: -1,
      protocol: 'ipfs',
    },
    nftType: 'onekind',
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
    networkIdentifier: COIN_NAME,
    symbol: 'EYECL',
    serial: '1A',
    name: 'EyeCollection',
    description:
      'A lot of eye collection with mind blowing utility that goes beyond arts and collectible, we try to create something remarkable with eyes and your vision. Eyes symbolyze how we see something new on the world, so this collection also emphasize new vision for humanity and NFT world as a whole',
    owner: {
      photo: '',
      base32: 'envtffov2qcqeemewg9acqdvx87n3ra7c5xbwpmnk4',
      address: 'f7982c5475b58b6bfdb91d7420bdc744b2e1ac26',
      username: '',
    },
    creator: {
      photo: '',
      base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
      address: '730917d362b38e434918d4ea1b905f5c159ca053',
      username: '',
    },
    price: {
      amount: '14328123432',
      currency: COIN_NAME,
    },
    onSale: shuffleArray([true, false]),
    data: {
      cid: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
      mime: 'image/jpeg',
      extension: 'jpg',
      size: -1,
      protocol: 'ipfs',
    },
    nftType: 'onekind',
    utility: 'content',
    rarity: {
      stat: {
        rank: 12,
        percent: 4,
      },
      trait: [
        {
          key: 'utility',
          value: 'content',
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
          'eyJub25jZSI6IjJhNzllMjhhZmZmYWQwNTA4OGFiZWQ3NjU2ZGExZTJiZmY1NGNjZTI4ZjMyZjY0ZCIsImVuY3J5cHRlZE1lc3NhZ2UiOiJlY2VkNGQ2ZGU5NjgzY2RjNjI4YWIzODcyOTZjMjNhNTM0YTc1NDlkNmFkNmIwODI1ODNmYTE5MDI1Mjg0MDIwY2Q0ZjMyMmRhOGRkMDg0MWIwMGI4MTI1OWJlZGU3ZDM4NGU5YzhkOGJkYjM4MzczMDI5ZWFkNjlkZjc1OGNhNmVjMTI5YjUyZWEzYmUyOWE4YjI5ZmJjZjg3NmVmYjhmYWZlYzE5NjgwNDA4MWM3MjIxODNmZjFiNjcxMmJjZGYxNTg3NDRmN2U5ZTdmNDM2NzQ3OWY0ZmQ4YzY3MzE4ZmQyZDJmZDA3MDcxN2IwNGJiZTYwZTY1Yzk0NmIwYjU2YzhkZjA1MjU2ZTRjZGQzYmI0MWY0MGNmNTI5OWQxNzc4YjEwY2Q0YjExNzAwMjg5NDI0YzM5NzYzNTUyOTA2MTk1MzQ4MzdlNWVlOGJiNDIxNTM1MTllMzI0Yzg2MzVjNWEwZWU5NzVjNGYyYjAxYTk3YWJhM2I4NjExZDc2ZDMxNTc3YjFiOTYxNGM2ODgxNWVmMzVhMzcxOWM1ZjM1NGIwNzljYjgzY2MwOTgwZDJhODBhNjE0ZDMyYmJjZWYxZDYzYzg2YmI2ODM2OGI4NDU5NTYxMTljZGNhNTQyNGU3NmYwNWIwMDFhOTE1NzUzZGZkYjNlZGFkOGVjZTJhOTU5NWEzNzQxYWU4MGEzZTM5ZGQ4NTQxY2NhYWEwMGRkIn0=',
        signature: {
          cipher:
            '6c691c2139f32017e6fbe81ce849e728838dec3ffa24f0417dce617aa8fa66d2fe2f115bb9f11cf321553ce4a60e751157dc941800c473c77feec7a70f8ef805',
          plain:
            '6c691c2139f32017e6fbe81ce849e728838dec3ffa24f0417dce617aa8fa66d2fe2f115bb9f11cf321553ce4a60e751157dc941800c473c77feec7a70f8ef805',
        },
        sender: '44fc724f611d822fbb946e4084d27cc07197bb3ab4d0406a17ade813cd7aee15',
        recipient: 'e177126884d05e6ea1f833c05949cf8af45fdcb6d8017d55f75ab26384b78af9',
      },
      content: {
        cid: 'QmYanPVeUCBKfxXGcTBCjS8HjYLuf3qscqGV1peF5iszkC',
        mime: 'audio/mpeg',
        extension: 'mp3',
        size: 3548243,
        protocol: 'ipfs',
        iv: '5899c28e12159a2b65c097054a58c0c3',
        salt: '9136de3e95f38b5207be8ef9d8fd322a',
        version: 1,
      },
      schedule: {
        recurring: 'monthly',
        time: {
          day: -1,
          date: 16,
          month: -1,
          year: -1,
        },
        from: {
          hour: 13,
          minute: 0,
        },
        until: 3600000,
      },
    },
    activity: [
      {
        transaction: 'veavaefasdfff',
        name: 'mint',
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
          username: '',
        },
        value: { amount: '2535623412', currency: COIN_NAME },
        date: 1649172800701,
      },
      {
        transaction: 'vewe34avaefaff',
        name: 'mint',
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
          address: '730917d362b38e434918d4ea1b905f5c159ca053',
          username: '',
        },
        value: { amount: '2535623412', currency: COIN_NAME },
        date: 1649172800701,
      },
      {
        transaction: 'veavaefaff',
        name: 'mint',
        to: {
          photo: '',
          base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
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

export const getStakePoolStakerData = (): StakePoolData['staker'] => {
  return [
    {
      id: 'sdfuvyb43r68bdfawrfqwfwewaf',
      persona: {
        photo: '',
        base32: 'envt7opy8ksve7npbr32dtqxwpvg5u6aa3vtje5qtd',
        address: '730917d362b38e434918d4ea1b905f5c159ca053',
        username: 'aldhosutra',
      },
      rank: 1,
      stake: '250300000000',
      portion: 0.2134,
    },
    {
      id: 'sdfuvyb43r68bdfawrfqwfwewaf',
      persona: {
        photo: 'bafybeif42jbs3t3pxjbz4635siv2u5nzxp5h7ffcsrwwvixgsclcn7rgza',
        base32: 'envt9w9qc6vs4d3qyqh322n69pebc2fdvsy4xsg5c9',
        address: '730917d362b38e434918d4ea1b905f5c159ca053',
        username: 'bayuwahyuadi',
      },
      rank: 2,
      stake: '20300000000',
      portion: 0.234,
    },
    {
      id: 'sdfuvyb43r68bdfawrfqwfwewaf',
      persona: {
        photo: '',
        base32: 'envt3kocke8xfya6p83cenoxqzx268kyztmfcag92z',
        address: '730917d362b38e434918d4ea1b905f5c159ca053',
        username: '',
      },
      rank: 3,
      stake: '5300000000',
      portion: 0.14,
    },
  ];
};
