import { Persona } from 'enevti-app/types/core/account/persona';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { APIResponse } from 'enevti-app/types/core/service/api';
import { urlGetTagCollection, urlGetTagNFT, urlGetTagUsername } from 'enevti-app/utils/constant/URLCreator';
import { apiFetch } from 'enevti-app/utils/network';

export type CollectionTag = {
  name: Collection['name'];
  id: Collection['id'];
  cover: Collection['cover'];
  symbol: Collection['symbol'];
  creator: Collection['creator'];
};

async function fetchTagUsername(username: string, signal?: AbortController['signal']): Promise<APIResponse<Persona[]>> {
  return await apiFetch<Persona[]>(urlGetTagUsername(username), signal);
}

async function fetchTagCollection(
  collectionName: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<CollectionTag[]>> {
  return await apiFetch<CollectionTag[]>(urlGetTagCollection(collectionName), signal);
}

async function fetchTagNFT(
  nftSerial: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<(NFTBase & { owner: Persona })[]>> {
  return await apiFetch<(NFTBase & { owner: Persona })[]>(urlGetTagNFT(nftSerial), signal);
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
