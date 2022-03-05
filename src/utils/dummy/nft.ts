import blankNFTTemplate from '../../components/atoms/nft/template/blankNFTTemplate';
import { NFTBase } from '../../types/nft';
import { NFTTemplateData } from '../../types/nft/NFTTemplate';
import { NFTUtility } from '../../types/nft/NFTUtility';
import { shuffleArray } from '../primitive/array';

export const makeDummyNFT = (
  template: NFTTemplateData = blankNFTTemplate,
  data: string = 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
): NFTBase => {
  const utilityOption: NFTUtility[] = [
    'videocall',
    'chat',
    'content',
    'qr',
    'stream',
    'gift',
  ];
  const shuffledUtility = shuffleArray(utilityOption);

  const partSize = [1, 4, 9, 16];
  const shuffledPartSize = shuffleArray(partSize);

  const nftType = ['onekind', 'pack'];

  return {
    id: 'id',
    symbol: 'SYMBL',
    serial: Math.floor(Math.random() * 100),
    name: 'Collection Name',
    data: data,
    contentType: 'image',
    NFTType: shuffleArray(nftType),
    utility: shuffledUtility,
    rarity: {
      stat: {
        rank: Math.floor(Math.random() * 100),
        percent: Math.floor(Math.random() * 100),
      },
      trait: [
        {
          key: 'utility',
          value: shuffledUtility,
        },
      ],
    },
    redeem: {
      parts: new Array(shuffledPartSize).fill('id'),
      upgradeMaterial: shuffledPartSize,
    },
    template: template,
  };
};
