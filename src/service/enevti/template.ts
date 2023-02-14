import { NFTTemplateAsset } from 'enevti-types/chain/nft/NFTTemplate';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import blankNFTTemplate from 'enevti-app/components/atoms/nft/template/blankNFTTemplate';
import { apiFetch } from 'enevti-app/utils/app/network';
import { urlGetAllNFTTemplate } from 'enevti-app/utils/constant/URLCreator';
import { APIResponse } from 'enevti-types/service/api';

export function getBuiltInNFTTemplate(): NFTTemplateAsset[] {
  return [
    {
      id: 'blankNFTTemplate',
      name: 'Blank Template',
      description: 'Template to fully highlight your creation!',
      data: blankNFTTemplate,
    },
    {
      id: 'enevtiNFTTemplate',
      name: 'Enevti.com Template',
      description: 'Present utility traits of your NFT in a beautiful way!',
      data: enevtiNFTTemplate,
    },
  ];
}

export async function getMoreNFTTemplate(signal?: AbortController['signal']): Promise<APIResponse<NFTTemplateAsset[]>> {
  return await apiFetch<NFTTemplateAsset[]>(urlGetAllNFTTemplate(), signal);
}
