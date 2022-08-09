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
import { apiFetch, apiFetchVersioned } from 'enevti-app/utils/network';
import { APIResponse, APIResponseVersioned } from 'enevti-app/types/core/service/api';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { COLLECTION_ACTIVITY_INITIAL_LENGTH, COLLECTION_MINTED_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { getMyAddress } from './persona';
import i18n from 'enevti-app/translations/i18n';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];

async function fetchCollectionById(id: string, signal?: AbortController['signal']): Promise<APIResponse<Collection>> {
  const myAddress = await getMyAddress();
  return await apiFetch<Collection>(urlGetCollectionById(id, myAddress), signal);
}

async function fetchCollectionBySymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Collection>> {
  const myAddress = await getMyAddress();
  return await apiFetch<Collection>(urlGetCollectionBySymbol(symbol, myAddress), signal);
}

async function fetchCollectionIdFromSymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetSymbolToCollectionId(symbol), signal);
}

async function fetchCollectionIdFromName(
  name: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetNameToCollectionId(name), signal);
}

async function fetchCollectionMinted(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await apiFetchVersioned<NFTBase[]>(urlGetCollectionMintedNFTById(id, offset, limit, version), signal);
}

async function fetchCollectionActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CollectionActivity[]>> {
  return await apiFetchVersioned<CollectionActivity[]>(
    urlGetCollectionActivityById(id, offset, limit, version),
    signal,
  );
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
      if (collectionId.status !== 200) {
        throw Error(i18n.t('error:clientError'));
      }
      return collectionId.data;
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
