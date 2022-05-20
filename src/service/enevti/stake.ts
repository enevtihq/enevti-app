import { StakePoolData, StakerItem } from 'enevti-app/types/core/chain/stake';
import { base32ToAddress } from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import {
  urlGetStakePoolByAddress,
  urlGetStakePoolByUsername,
  urlGetStaker,
} from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, APIResponseVersioned, ResponseJSON, ResponseVersioned } from 'enevti-app/types/core/service/api';
import { STAKER_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];

async function fetchStakePool(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetStakePoolByAddress(address), { signal });
    const ret = (await res.json()) as ResponseJSON<StakePoolData>;
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

async function fetchStakePoolByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetStakePoolByUsername(username), { signal });
    const ret = (await res.json()) as ResponseJSON<StakePoolData>;
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

async function fetchStakePoolStaker(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<StakerItem[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetStaker(address, offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<ResponseVersioned<StakerItem[]>>;
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

export async function getStakePoolData(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  return await fetchStakePool(address, signal);
}

export async function getStakePoolStaker(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<StakerItem[]>> {
  return await fetchStakePoolStaker(address, offset, limit, version, signal);
}

export async function getStakePoolInitialStaker(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<StakerItem[]>> {
  return await fetchStakePoolStaker(address, 0, STAKER_INITIAL_LENGTH, 0, signal);
}

export async function getStakePoolDataByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  return await fetchStakePoolByUsername(username, signal);
}

export async function getStakePoolDataByRouteParam(routeParam: StakePoolRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'a':
      return await fetchStakePool(routeParam.arg, signal);
    case 'b':
      const address = base32ToAddress(routeParam.arg);
      return await fetchStakePool(address, signal);
    case 'u':
      return await fetchStakePoolByUsername(routeParam.arg, signal);
    default:
      return await fetchStakePool(routeParam.arg, signal);
  }
}
