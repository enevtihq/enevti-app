import BigNumber from 'bignumber.js';
import { Profile } from 'enevti-app/types/core/account/profile';
import { store } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import {
  selectMyProfileCache,
  setLastFetchMyProfileCache,
  setLastFetchMyProfileCollectionCache,
  setLastFetchMyProfileOwnedCache,
  setMyProfileCache,
  setMyProfileCacheCollectionPagination,
  setMyProfileCacheOwnedPagination,
} from 'enevti-app/store/slices/entities/cache/myProfile';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { addressToBase32, base32ToAddress, getMyAddress, usernameToAddress } from './persona';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import {
  urlGetProfile,
  urlGetProfileBalance,
  urlGetProfileCollection,
  urlGetProfileNonce,
  urlGetProfileOwned,
  urlGetProfilePendingDelivery,
  urlGetUsernameToAddress,
} from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, isErrorResponse, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON, APIResponseVersioned, ResponseVersioned } from 'enevti-app/types/core/service/api';
import { NFTSecret } from 'enevti-app/types/core/chain/nft/NFTSecret';
import { RootStackParamList } from 'enevti-app/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { PROFILE_OWNED_INITIAL_LENGTH, PROFILE_COLLECTION_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { NFTBase } from 'enevti-app/types/core/chain/nft';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;
type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];

async function fetchProfileBalance(address: string, signal?: AbortController['signal']): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfileBalance(address), { signal });
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

async function fetchProfileNonce(address: string, signal?: AbortController['signal']): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfileNonce(address), { signal });
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

async function fetchProfilePendingDelivery(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<{ id: string; secret: NFTSecret }[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfilePendingDelivery(address), { signal });
    const ret = (await res.json()) as ResponseJSON<{ id: string; secret: NFTSecret }[]>;
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

async function fetchProfile(address: string, signal?: AbortController['signal']): Promise<APIResponse<Profile>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfile(address), { signal });
    const ret = (await res.json()) as ResponseJSON<Profile>;
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

async function fetchProfileAddressFromUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetUsernameToAddress(username), { signal });
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

async function fetchProfileOwned(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<NFTBase[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfileOwned(address, offset, limit, version), { signal });
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

async function fetchProfileCollection(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<Profile['collection']>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetProfileCollection(address, offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<ResponseVersioned<Profile['collection']>>;
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
      const base32 = addressToBase32(routeParam.arg);
      return await getProfileBalance(base32, signal);
    case 'u':
      const address = await usernameToAddress(routeParam.arg);
      return await getProfileBalance(address, signal);
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
): Promise<APIResponse<string>> {
  return await fetchProfileNonce(address, signal);
}

export async function getProfilePendingDelivery(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<{ id: string; secret: NFTSecret }[]>> {
  return await fetchProfilePendingDelivery(address, signal);
}

export async function getProfile(address: string, signal?: AbortController['signal']): Promise<APIResponse<Profile>> {
  return await fetchProfile(address, signal);
}

export async function getMyProfile(
  force: boolean = false,
  signal?: AbortController['signal'],
): Promise<APIResponse<Profile>> {
  await sleep(1);
  const now = Date.now();
  const myAddress = await getMyAddress();
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch.profile ?? 0;
  let response: APIResponse<Profile> = {
    status: 200,
    data: selectMyProfileCache(store.getState()),
    meta: {},
  };

  try {
    if (force || now - lastFetch > lastFetchTimeout.profile) {
      const profileResponse = await getProfile(myAddress, signal);
      if (profileResponse.status === 200 && !isErrorResponse(profileResponse)) {
        response.data = profileResponse.data;
        store.dispatch(setLastFetchMyProfileCache(now));
        store.dispatch(setMyProfileCache(parseProfileCache(profileResponse.data as Profile)));
      } else {
        response.status = profileResponse.status;
        response.data = profileResponse.data;
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
      if (ownedResponse.status === 200 && !isErrorResponse(ownedResponse)) {
        response.data = ownedResponse.data;
        store.dispatch(setLastFetchMyProfileOwnedCache(now));
        store.dispatch(
          setMyProfileCacheOwnedPagination({ checkpoint: response.data.checkpoint, version: response.data.version }),
        );
        store.dispatch(
          setMyProfileCache({ ...selectMyProfileCache(store.getState()), owned: ownedResponse.data.data }),
        );
      } else {
        response.status = ownedResponse.status;
        response.data = ownedResponse.data;
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
      if (collectionResponse.status === 200 && !isErrorResponse(collectionResponse)) {
        response.data = collectionResponse.data;
        store.dispatch(setLastFetchMyProfileCollectionCache(now));
        store.dispatch(
          setMyProfileCacheCollectionPagination({
            checkpoint: response.data.checkpoint,
            version: response.data.version,
          }),
        );
        store.dispatch(
          setMyProfileCache({ ...selectMyProfileCache(store.getState()), collection: collectionResponse.data.data }),
        );
      } else {
        response.status = collectionResponse.status;
        response.data = collectionResponse.data;
      }
    }
  } catch {}

  return response;
}

export function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gte(completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY));
}
