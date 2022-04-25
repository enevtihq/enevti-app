import { StakePoolData } from 'enevti-app/types/core/chain/stake';
import { base32ToAddress } from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { isInternetReachable } from 'enevti-app/utils/network';
import {
  urlGetStakePoolByAddress,
  urlGetStakePoolByUsername,
} from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];

async function fetchStakePool(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  try {
    await isInternetReachable();
    const res = await fetch(urlGetStakePoolByAddress(address), { signal });
    handleResponseCode(res);
    const ret = (await res.json()) as ResponseJSON<StakePoolData>;
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
    const res = await fetch(urlGetStakePoolByUsername(username), { signal });
    handleResponseCode(res);
    const ret = (await res.json()) as ResponseJSON<StakePoolData>;
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

export async function getStakePoolDataByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<StakePoolData>> {
  return await fetchStakePoolByUsername(username, signal);
}

export async function getStakePoolDataByRouteParam(
  routeParam: StakePoolRoute,
  signal?: AbortController['signal'],
) {
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
