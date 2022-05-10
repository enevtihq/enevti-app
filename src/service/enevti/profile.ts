import BigNumber from 'bignumber.js';
import { Profile } from 'enevti-app/types/core/account/profile';
import { store } from 'enevti-app/store/state';
import sleep from 'enevti-app/utils/dummy/sleep';
import {
  selectMyProfileCache,
  setLastFetchMyProfileCache,
  setMyProfileCache,
} from 'enevti-app/store/slices/entities/cache/myProfile';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { getMyAddress } from './persona';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { urlGetProfile, urlGetProfileNonce } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, isErrorResponse, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

export const MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY = 1000;

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

export function parseProfileCache(profile: Profile) {
  return { ...profile };
}

export async function getProfileNonce(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  return await fetchProfileNonce(address, signal);
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
  const lastFetch = selectMyProfileCache(store.getState()).lastFetch;
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

export function isProfileCanCreateNFT(profile: Profile) {
  return new BigNumber(profile.stake).gte(completeTokenUnit(MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY));
}
