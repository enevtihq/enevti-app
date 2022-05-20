import { StackScreenProps } from '@react-navigation/stack';
import { Collection, CollectionActivity } from 'enevti-app/types/core/chain/collection';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  urlGetCollectionActivityById,
  urlGetCollectionById,
  urlGetCollectionBySymbol,
  urlGetCollectionMintedNFTById,
  urlGetNameToCollectionId,
  urlGetSymbolToCollectionId,
} from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { APIResponse, APIResponseVersioned, ResponseJSON, ResponseVersioned } from 'enevti-app/types/core/service/api';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { COLLECTION_ACTIVITY_INITIAL_LENGTH, COLLECTION_MINTED_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];

async function fetchCollectionById(id: string, signal?: AbortController['signal']): Promise<APIResponse<Collection>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionById(id), { signal });
    const ret = (await res.json()) as ResponseJSON<Collection>;
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

async function fetchCollectionBySymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Collection>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionBySymbol(symbol), { signal });
    const ret = (await res.json()) as ResponseJSON<Collection>;
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

async function fetchCollectionIdFromSymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetSymbolToCollectionId(symbol), { signal });
    const ret = (await res.json()) as ResponseJSON<string>;
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

async function fetchCollectionIdFromName(
  name: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetNameToCollectionId(name), { signal });
    const ret = (await res.json()) as ResponseJSON<string>;
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

async function fetchCollectionMinted(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionMintedNFTById(id, offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<ResponseVersioned<NFTBase[]>>;
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

async function fetchCollectionActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CollectionActivity[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionActivityById(id, offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<ResponseVersioned<CollectionActivity[]>>;
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

export async function getCollectionMinted(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await fetchCollectionMinted(id, offset, limit, version, signal);
}

export async function getCollectionActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CollectionActivity[]>> {
  return await fetchCollectionActivity(id, offset, limit, version, signal);
}

export async function getCollectionInitialMinted(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await fetchCollectionMinted(id, 0, COLLECTION_MINTED_INITIAL_LENGTH, 0, signal);
}

export async function getCollectionInitialActivity(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CollectionActivity[]>> {
  return await fetchCollectionActivity(id, 0, COLLECTION_ACTIVITY_INITIAL_LENGTH, 0, signal);
}

export async function getCollectionIdFromSymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchCollectionIdFromSymbol(symbol, signal);
}

export async function getCollectionIdFromName(
  name: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchCollectionIdFromName(name, signal);
}

export async function getCollectionIdFromRouteParam(routeParam: CollectionRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'id':
      return routeParam.arg;
    case 's':
      const collectionId = await getCollectionIdFromSymbol(routeParam.arg, signal);
      return collectionId;
  }
}

export async function getCollectionById(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Collection>> {
  return await fetchCollectionById(id, signal);
}

export async function getCollectionByRouteParam(routeParam: CollectionRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 's':
      return await fetchCollectionBySymbol(routeParam.arg, signal);
    case 'id':
      return await fetchCollectionById(routeParam.arg, signal);
    default:
      return await fetchCollectionById(routeParam.arg, signal);
  }
}
