import BigNumber from 'bignumber.js';
import { Profile, ProfileAPIResponse, ProfileAPIVersion } from 'enevti-app/types/core/account/profile';
import { store } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import {
  selectMyProfileCache,
  setLastFetchMyProfileCollectionCache,
  setLastFetchMyProfileOwnedCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { base32ToAddress, getMyAddress, usernameToAddress } from './persona';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import { apiFetch, apiFetchVersioned, apiFetchVersionRoot } from 'enevti-app/utils/app/network';
import {
  urlGetProfile,
  urlGetProfileBalance,
  urlGetProfileCollection,
  urlGetProfileMoment,
  urlGetProfileMomentSlot,
  urlGetProfileNonce,
  urlGetProfileOwned,
  urlGetProfilePendingDelivery,
  urlGetUsernameToAddress,
} from 'enevti-app/utils/constant/URLCreator';
import { isErrorResponse } from 'enevti-app/utils/error/handle';
import { APIResponse, APIResponseVersioned, APIResponseVersionRoot } from 'enevti-app/types/core/service/api';
import { NFTSecret } from 'enevti-app/types/core/chain/nft/NFTSecret';
import { RootStackParamList } from 'enevti-app/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import {
  PROFILE_OWNED_INITIAL_LENGTH,
  PROFILE_COLLECTION_INITIAL_LENGTH,
  PROFILE_MOMENT_SLOT_INITIAL_LENGTH,
  PROFILE_MOMENT_INITIAL_LENGTH,
} from 'enevti-app/utils/constant/limit';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { selectMyPersonaCache, setMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { MomentBase } from 'enevti-app/types/core/chain/moment';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;
type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];

async function fetchProfileBalance(address: string, signal?: AbortController['signal']): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetProfileBalance(address), signal);
}

async function fetchProfileNonce(
  address: string,
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetProfileNonce(address), signal, silent);
}

async function fetchProfilePendingDelivery(
  address: string,
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponse<{ id: string; secret: NFTSecret }[]>> {
  return await apiFetch<{ id: string; secret: NFTSecret }[]>(
    urlGetProfilePendingDelivery(address),
    signal,
    silent,
    'err.message',
  );
}

async function fetchProfile(
  address: string,
  withPersona: boolean = false,
  withInitialData: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<ProfileAPIResponse, ProfileAPIVersion>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<ProfileAPIResponse, ProfileAPIVersion>(
    urlGetProfile(address, myAddress, withPersona, withInitialData),
    signal,
  );
}

async function fetchProfileAddressFromUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await apiFetch<string>(urlGetUsernameToAddress(username), signal);
}

async function fetchProfileMomentSlot(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await apiFetchVersioned<NFTBase[]>(urlGetProfileMomentSlot(address, offset, limit, version), signal);
}

async function fetchProfileMoment(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<MomentBase[]>(urlGetProfileMoment(address, offset, limit, version, myAddress), signal);
}

async function fetchProfileOwned(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await apiFetchVersioned<NFTBase[]>(urlGetProfileOwned(address, offset, limit, version), signal);
}

async function fetchProfileCollection(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['collection']>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<Profile['collection']>(
    urlGetProfileCollection(address, offset, limit, version, myAddress),
    signal,
  );
}

export async function getProfileInitialOwned(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['owned']>> {
  return await fetchProfileOwned(address, 0, PROFILE_OWNED_INITIAL_LENGTH, 0, signal);
}

export async function getProfileInitialCollection(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['collection']>> {
  return await fetchProfileCollection(address, 0, PROFILE_COLLECTION_INITIAL_LENGTH, 0, signal);
}

export async function getProfileInitialMomentSlot(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await fetchProfileMomentSlot(address, 0, PROFILE_MOMENT_SLOT_INITIAL_LENGTH, 0, signal);
}

export async function getProfileMomentSlot(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  return await fetchProfileMomentSlot(address, offset, limit, version, signal);
}

export async function getProfileMoment(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<MomentBase[]>> {
  return await fetchProfileMoment(address, offset, limit, version, signal);
}

export async function getProfileOwned(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['owned']>> {
  return await fetchProfileOwned(address, offset, limit, version, signal);
}

export async function getProfileCollection(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['collection']>> {
  return await fetchProfileCollection(address, offset, limit, version, signal);
}

export async function getProfileAddressFromUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchProfileAddressFromUsername(username, signal);
}

export async function getProfileAddressFromRouteParam(routeParam: ProfileRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'a':
      return routeParam.arg;
    case 'b':
      return base32ToAddress(routeParam.arg);
    case 'u':
      const address = await getProfileAddressFromUsername(routeParam.arg, signal);
      return address.data;
  }
}

export function parseProfileCache(profile: Profile) {
  return { ...profile };
}

export async function getProfileBalanceByRouteParam(
  routeParam: { mode: 'a' | 'b' | 'u'; arg: string },
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  switch (routeParam.mode) {
    case 'a':
      return await getProfileBalance(routeParam.arg, signal);
    case 'b':
      return await getProfileBalance(base32ToAddress(routeParam.arg), signal);
    case 'u':
      return await getProfileBalance(await usernameToAddress(routeParam.arg), signal);
    default:
      return await getProfileBalance(routeParam.arg, signal);
  }
}

export async function getProfileBalance(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchProfileBalance(address, signal);
}

export async function getProfileNonce(
  address: string,
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponse<string>> {
  return await fetchProfileNonce(address, signal, silent);
}

export async function getProfilePendingDelivery(
  address: string,
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponse<{ id: string; secret: NFTSecret }[]>> {
  return await fetchProfilePendingDelivery(address, signal, silent);
}

export async function getProfile(
  address: string,
  withPersona: boolean = false,
  withInitialData: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<ProfileAPIResponse, ProfileAPIVersion>> {
  return await fetchProfile(address, withPersona, withInitialData, signal);
}

export async function getMyProfile(
  force: boolean = false,
  withPersona: boolean = false,
  withInitialData: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<ProfileAPIResponse, ProfileAPIVersion>> {
  await sleep(1);
  const now = Date.now();
  const myAddress = await getMyAddress();
  const myProfileCache = selectMyProfileCache(store.getState());
  const lastFetch = myProfileCache.lastFetch.profile ?? 0;
  const myPersona = selectMyPersonaCache(store.getState());
  let response: APIResponseVersionRoot<ProfileAPIResponse, ProfileAPIVersion> = {
    status: 200,
    data: {
      ...myProfileCache,
      persona: myPersona,
    },
    version: {
      collection: myProfileCache.collectionPagination.version,
      momentCreated: myProfileCache.momentPagination.version,
      onSale: myProfileCache.onSalePagination.version,
      owned: myProfileCache.ownedPagination.version,
    },
    meta: {},
  };

  try {
    if (force || now - lastFetch > lastFetchTimeout.profile) {
      const profileResponse = await getProfile(myAddress, withPersona, withInitialData, signal);
      response = profileResponse;
      if (profileResponse.status === 200 && !isErrorResponse(profileResponse)) {
        if (withPersona) {
          store.dispatch(setMyPersonaCache({ ...profileResponse.data.persona }));
        }
        if (withInitialData) {
          store.dispatch(
            setMyProfileCache({
              ...parseProfileCache(profileResponse.data as Profile),
              lastFetch: {
                profile: now,
                owned: now,
                collection: now,
                onSale: now,
                momentCreated: now,
              },
              ownedPagination: {
                checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
                version: profileResponse.version.owned,
              },
              collectionPagination: {
                checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
                version: profileResponse.version.collection,
              },
              momentPagination: {
                checkpoint: PROFILE_MOMENT_INITIAL_LENGTH,
                version: profileResponse.version.momentCreated,
              },
            }),
          );
        } else {
          store.dispatch(
            setMyProfileCache({
              ...parseProfileCache(profileResponse.data as Profile),
            }),
          );
        }
      }
    }
  } catch {}

  return response;
}

export async function getMyProfileInitialOwned(
  force: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['owned']>> {
  await sleep(1);
  const now = Date.now();
  const myAddress = await getMyAddress();
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch.owned ?? 0;
  let response: APIResponseVersioned<Profile['owned']> = {
    status: 200,
    data: {
      data: selectMyProfileCache(store.getState()).owned,
      checkpoint: selectMyProfileCache(store.getState()).ownedPagination.checkpoint,
      version: selectMyProfileCache(store.getState()).ownedPagination.version,
    },
    meta: {},
  };

  try {
    if (force || now - lastFetch > lastFetchTimeout.profileOwned) {
      const ownedResponse = await getProfileInitialOwned(myAddress, signal);
      response = ownedResponse;
      if (ownedResponse.status === 200 && !isErrorResponse(ownedResponse)) {
        store.dispatch(setLastFetchMyProfileOwnedCache(now));
        store.dispatch(
          setMyProfileCache({
            ...selectMyProfileCache(store.getState()),
            owned: ownedResponse.data.data,
            ownedPagination: { checkpoint: response.data.checkpoint, version: response.data.version },
          }),
        );
      }
    }
  } catch {}

  return response;
}

export async function getMyProfileInitialCollection(
  force: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['collection']>> {
  await sleep(1);
  const now = Date.now();
  const myAddress = await getMyAddress();
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch.collection ?? 0;
  let response: APIResponseVersioned<Profile['collection']> = {
    status: 200,
    data: {
      data: selectMyProfileCache(store.getState()).collection,
      checkpoint: selectMyProfileCache(store.getState()).collectionPagination.checkpoint,
      version: selectMyProfileCache(store.getState()).collectionPagination.version,
    },
    meta: {},
  };

  try {
    if (force || now - lastFetch > lastFetchTimeout.profileCollection) {
      const collectionResponse = await getProfileInitialCollection(myAddress, signal);
      response = collectionResponse;
      if (collectionResponse.status === 200 && !isErrorResponse(collectionResponse)) {
        store.dispatch(setLastFetchMyProfileCollectionCache(now));
        store.dispatch(
          setMyProfileCache({
            ...selectMyProfileCache(store.getState()),
            collection: collectionResponse.data.data,
            collectionPagination: {
              checkpoint: response.data.checkpoint,
              version: response.data.version,
            },
          }),
        );
      }
    }
  } catch {}

  return response;
}

export function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gte(completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY));
}
