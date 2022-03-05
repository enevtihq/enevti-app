import enevtiNFTTemplate from '../../components/atoms/nft/template/enevtiNFTTemplate';
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
    symbol: 'EYECL',
    serial: '1A',
    name: 'EyeCollection',
    data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
    contentType: 'image',
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
  setTimeout(() => null, time);
}
