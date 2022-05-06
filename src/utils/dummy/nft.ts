import blankNFTTemplate from 'enevti-app/components/atoms/nft/template/blankNFTTemplate';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { NFTTemplateData } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { NFTUtility } from 'enevti-app/types/core/chain/nft/NFTUtility';
import { shuffleArray } from 'enevti-app/utils/primitive/array';
import { makeDummyIPFS } from './ipfs';

export const makeDummyNFT = (
  type: 'onekind' | 'pack' | 'random' | string = 'random',
  template: NFTTemplateData = blankNFTTemplate,
  data: string = makeDummyIPFS(),
): NFTBase => {
  const utilityOption: NFTUtility[] = ['videocall', 'chat', 'content', 'qr', 'stream', 'gift'];
  const shuffledUtility = shuffleArray(utilityOption);

  const typeList = ['onekind', 'pack'];
  const nftType = type === 'random' ? shuffleArray(typeList) : type;

  const partSize = [1, 4, 9, 16];
  const shuffledPartSize = nftType === 'pack' ? shuffleArray(partSize) : 0;

  return {
    id: 'id',
    like: 0,
    price: { amount: '', currency: '' },
    onSale: false,
    symbol: 'SYMBL',
    serial: Math.floor(Math.random() * 100).toString(),
    name: 'Collection Name',
    data: {
      cid: data,
      mime: 'image/jpeg',
      extension: 'jpg',
      size: 0,
      protocol: 'ipfs',
    },
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
    partition: {
      parts: new Array(shuffledPartSize).fill('id'),
      upgradeMaterial: shuffledPartSize,
    },
    template: template,
  };
};
