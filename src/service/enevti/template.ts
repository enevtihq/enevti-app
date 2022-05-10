import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import enevtiNFTTemplate from 'enevti-app/components/atoms/nft/template/enevtiNFTTemplate';
import blankNFTTemplate from 'enevti-app/components/atoms/nft/template/blankNFTTemplate';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { urlGetAllNFTTemplate } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

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
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetAllNFTTemplate(), { signal });
    const ret = (await res.json()) as ResponseJSON<NFTTemplateAsset[]>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code);
  }
}
