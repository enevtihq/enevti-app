import { NFTBase } from '../../types/nft/index';
import { NFTUtility } from '../../types/nft/NFTUtility';

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
    serial: 'eyecollection-001',
    name: 'EyeCollection',
    data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
    contentType: 'image',
    NFTType: 'packed',
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
    template: {
      main: [
        {
          type: 'utility-background',
          args: {
            x: '0%',
            y: '0%',
            width: '100%',
            height: '100%',
            rotate: '0deg',
          },
        },
        {
          type: 'data-box',
          args: {
            x: '12.5%',
            y: '12.5%',
            width: '75%',
            height: '75%',
            rotate: '0deg',
          },
        },
        {
          type: 'box',
          args: {
            x: '42%',
            y: '0%',
            width: '16%',
            height: '15%',
            rotate: '0deg',
          },
        },
        {
          type: 'rarity-icon',
          args: {
            x: '42%',
            y: '0%',
            width: '16%',
            height: '8.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'rarity-rank',
          args: {
            x: '42%',
            y: '7.5%',
            width: '16%',
            height: '4%',
            rotate: '0deg',
          },
        },
        {
          type: 'rarity-percent',
          args: {
            x: '42%',
            y: '11.5%',
            width: '16%',
            height: '2%',
            rotate: '0deg',
          },
        },
        {
          type: 'name',
          args: {
            x: '12.5%',
            y: '87.5%',
            width: '75%',
            height: '12.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'serial',
          args: {
            x: '75%',
            y: '43.75%',
            width: '37.5%',
            height: '12.5%',
            rotate: '-90deg',
          },
        },
        {
          type: 'box',
          args: {
            x: '3%',
            y: '67%',
            width: '6.5%',
            height: '6.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'partition-icon',
          args: {
            x: '4%',
            y: '67.5%',
            width: '6.5%',
            height: '6.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'partition-label',
          args: {
            x: '-1%',
            y: '55%',
            width: '14%',
            height: '6.5%',
            rotate: '-90deg',
          },
        },
        {
          type: 'box',
          args: {
            x: '4%',
            y: '42.5%',
            width: '6.5%',
            height: '6.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'utility-icon',
          args: {
            x: '4.75%',
            y: '43%',
            width: '6.5%',
            height: '6.5%',
            rotate: '0deg',
          },
        },
        {
          type: 'utility-label',
          args: {
            x: '-5.5%',
            y: '25%',
            width: '25%',
            height: '6.5%',
            rotate: '-90deg',
          },
        },
      ],
      thumbnail: [
        {
          type: 'utility-background',
          args: {
            x: '0%',
            y: '0%',
            width: '100%',
            height: '100%',
            rotate: '0deg',
          },
        },
        {
          type: 'data-box',
          args: {
            x: '12.5%',
            y: '12.5%',
            width: '75%',
            height: '75%',
            rotate: '0deg',
          },
        },
      ],
    },
  };
};
