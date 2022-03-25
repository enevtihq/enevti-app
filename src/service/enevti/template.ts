import { sleep } from './dummy';
import { NFTTemplateAsset } from '../../types/nft/NFTTemplate';
import enevtiNFTTemplate from '../../components/atoms/nft/template/enevtiNFTTemplate';
import blankNFTTemplate from '../../components/atoms/nft/template/blankNFTTemplate';

export function getBuiltInNFTTemplate(): NFTTemplateAsset[] {
  return [
    {
      id: 'enevtiNFTTemplate',
      name: 'Enevti.com Template',
      description: 'Present utility traits of your NFT in a beautiful way!',
      data: enevtiNFTTemplate,
    },
    {
      id: 'blankNFTTemplate',
      name: 'Blank Template',
      description: 'Template to fully highlight your creation!',
      data: blankNFTTemplate,
    },
  ];
}

export async function getMoreNFTTemplate(): Promise<NFTTemplateAsset[]> {
  await sleep(1000);
  return [];
}
