import { StackScreenProps } from '@react-navigation/stack';
import { Collection, CollectionActivity } from 'enevti-types/chain/collection';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  urlGetCollectionActivityById,
  urlGetCollectionById,
  urlGetCollectionBySymbol,
  urlGetCollectionMintedNFTById,
  urlGetCollectionMomentNFTById,
  urlGetIsCollectionOwnerOrCreator,
  urlGetNameToCollectionId,
  urlGetSymbolToCollectionId,
} from 'enevti-app/utils/constant/URLCreator';
import { apiFetch, apiFetchVersioned, apiFetchVersionRoot } from 'enevti-app/utils/app/network';
import { APIResponse, APIResponseVersioned, APIResponseVersionRoot } from 'enevti-types/service/api';
import { NFTBase } from 'enevti-types/chain/nft';
import {
  COLLECTION_ACTIVITY_INITIAL_LENGTH,
  COLLECTION_MINTED_INITIAL_LENGTH,
  COLLECTION_MOMENT_INITIAL_LENGTH,
} from 'enevti-app/utils/constant/limit';
import { getMyAddress } from './persona';
import i18n from 'enevti-app/translations/i18n';
import { MomentBase } from 'enevti-types/chain/moment';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];
type CollectionVersions = { activity: number; minted: number; moment: number };

async function fetchIsCollectionOwnerOrCreator(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<boolean>> {
  const myAddress = await getMyAddress();
  return await apiFetch<boolean>(urlGetIsCollectionOwnerOrCreator(id, myAddress), signal);
}

async function fetchCollectionById(
  id: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<Collection, CollectionVersions>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<Collection, CollectionVersions>(
    urlGetCollectionById(id, myAddress, withInitialData),
    signal,
  );
}

async function fetchCollectionBySymbol(
  symbol: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<Collection, CollectionVersions>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<Collection, CollectionVersions>(
    urlGetCollectionBySymbol(symbol, myAddress, withInitialData),
    signal,
  );
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
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<NFTBase[]>(
    urlGetCollectionMintedNFTById(id, offset, limit, version, myAddress),
    signal,
  );
}

async function fetchCollectionMoment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await apiFetchVersioned<MomentBase[]>(urlGetCollectionMomentNFTById(id, offset, limit, version), signal);
}

async function fetchCollectionActivity(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CollectionActivity[]>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CollectionActivity[]>(
    urlGetCollectionActivityById(id, offset, limit, version, myAddress),
    signal,
  );
}

export async function getIsCollectionOwnerOrCreator(id: string, signal?: AbortController['signal']) {
  return await fetchIsCollectionOwnerOrCreator(id, signal);
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

export async function getCollectionMoment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await fetchCollectionMoment(id, offset, limit, version, signal);
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

export async function getCollectionInitialMoment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await fetchCollectionMoment(id, 0, COLLECTION_MOMENT_INITIAL_LENGTH, 0, signal);
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
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<Collection, CollectionVersions>> {
  return await fetchCollectionById(id, withInitialData, signal);
}

export async function getCollectionByRouteParam(
  routeParam: CollectionRoute,
  withInitialData: boolean,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 's':
      return await fetchCollectionBySymbol(routeParam.arg, withInitialData, signal);
    case 'id':
      return await fetchCollectionById(routeParam.arg, withInitialData, signal);
    default:
      return await fetchCollectionById(routeParam.arg, withInitialData, signal);
  }
}

export async function getIsCollectionOwnerOrCreatorByRouteParam(
  routeParam: CollectionRoute,
  signal?: AbortController['signal'],
) {
  const id = await getCollectionIdFromRouteParam(routeParam, signal);
  return await fetchIsCollectionOwnerOrCreator(id, signal);
}
