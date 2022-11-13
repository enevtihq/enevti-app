import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import blankNFTTemplate from 'enevti-app/components/atoms/nft/template/blankNFTTemplate';
import { apiFetch } from 'enevti-app/utils/app/network';
import { urlGetAllNFTTemplate } from 'enevti-app/utils/constant/URLCreator';
import { APIResponse } from 'enevti-app/types/core/service/api';

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

export async function getMoreNFTTemplate(signal?: AbortController['signal']): Promise<APIResponse<NFTTemplateAsset[]>> {
  return await apiFetch<NFTTemplateAsset[]>(urlGetAllNFTTemplate(), signal);
}
