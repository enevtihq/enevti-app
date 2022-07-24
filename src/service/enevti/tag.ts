import { Persona } from 'enevti-app/types/core/account/persona';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import { urlGetTagCollection, urlGetTagNFT, urlGetTagUsername } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';

export type CollectionTag = {
  name: Collection['name'];
  id: Collection['id'];
  cover: Collection['cover'];
  symbol: Collection['symbol'];
  creator: Collection['creator'];
};

async function fetchTagUsername(username: string, signal?: AbortController['signal']): Promise<APIResponse<Persona[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTagUsername(username), { signal });
    const ret = (await res.json()) as ResponseJSON<Persona[]>;
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

async function fetchTagCollection(
  collectionName: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<CollectionTag[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTagCollection(collectionName), { signal });
    const ret = (await res.json()) as ResponseJSON<CollectionTag[]>;
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

async function fetchTagNFT(
  nftSerial: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<(NFTBase & { owner: Persona })[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTagNFT(nftSerial), { signal });
    const ret = (await res.json()) as ResponseJSON<(NFTBase & { owner: Persona })[]>;
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

export async function getTagUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Persona[]>> {
  return await fetchTagUsername(username, signal);
}

export async function getTagCollection(
  collectionName: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<CollectionTag[]>> {
  return await fetchTagCollection(collectionName, signal);
}

export async function getTagNFT(
  nftSerial: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<(NFTBase & { owner: Persona })[]>> {
  return await fetchTagNFT(nftSerial, signal);
}
