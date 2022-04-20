import sleep from 'enevti-app/utils/dummy/sleep';
import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import blankNFTTemplate from 'enevti-app/components/atoms/nft/template/blankNFTTemplate';

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

export async function getMoreNFTTemplate(
  signal?: AbortController['signal'],
): Promise<NFTTemplateAsset[]> {
  await sleep(1000, signal);
  return [];
}
