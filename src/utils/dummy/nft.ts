import blankNFTTemplate from '../../components/atoms/nft/template/blankNFTTemplate';
import { NFTBase } from '../../types/nft';
import { NFTTemplateData } from '../../types/nft/NFTTemplate';
import { NFTUtility } from '../../types/nft/NFTUtility';
import { shuffleArray } from '../primitive/array';

export const makeDummyNFT = (
  type: 'onekind' | 'pack' | 'random' | string = 'random',
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

  const typeList = ['onekind', 'pack'];
  const nftType = type === 'random' ? shuffleArray(typeList) : type;

  const partSize = [1, 4, 9, 16];
  const shuffledPartSize = nftType === 'pack' ? shuffleArray(partSize) : 0;

  return {
    id: 'id',
    symbol: 'SYMBL',
    serial: Math.floor(Math.random() * 100).toString(),
    name: 'Collection Name',
    data: data,
    contentType: 'image',
    NFTType: nftType,
    utility: shuffledUtility,
    rarity: {
      stat: {
        rank: Math.floor(Math.random() * 100) + 1,
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
