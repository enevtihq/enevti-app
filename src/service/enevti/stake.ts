import { StakePoolData, StakerItem } from 'enevti-app/types/core/chain/stake';
import { base32ToAddress } from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { apiFetchVersioned, apiFetchVersionRoot } from 'enevti-app/utils/app/network';
import {
  urlGetStakePoolByAddress,
  urlGetStakePoolByUsername,
  urlGetStaker,
} from 'enevti-app/utils/constant/URLCreator';
import { APIResponseVersioned, APIResponseVersionRoot } from 'enevti-app/types/core/service/api';
import { STAKER_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];

async function fetchStakePool(
  address: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<StakePoolData, { stakePool: number }>> {
  return await apiFetchVersionRoot<StakePoolData, { stakePool: number }>(
    urlGetStakePoolByAddress(address, withInitialData),
    signal,
  );
}

async function fetchStakePoolByUsername(
  username: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<StakePoolData, { stakePool: number }>> {
  return await apiFetchVersionRoot<StakePoolData, { stakePool: number }>(
    urlGetStakePoolByUsername(username, withInitialData),
    signal,
  );
}

async function fetchStakePoolStaker(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<StakerItem[]>> {
  return await apiFetchVersioned<StakerItem[]>(urlGetStaker(address, offset, limit, version), signal);
}

export async function getStakePoolData(
  address: string,
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<StakePoolData, { stakePool: number }>> {
  return await fetchStakePool(address, withInitialData, signal);
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
  withInitialData: boolean,
  signal?: AbortController['signal'],
): Promise<APIResponseVersionRoot<StakePoolData, { stakePool: number }>> {
  return await fetchStakePoolByUsername(username, withInitialData, signal);
}

export async function getStakePoolDataByRouteParam(
  routeParam: StakePoolRoute,
  withInitialData: boolean,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 'a':
      return await fetchStakePool(routeParam.arg, withInitialData, signal);
    case 'b':
      const address = base32ToAddress(routeParam.arg);
      return await fetchStakePool(address, withInitialData, signal);
    case 'u':
      return await fetchStakePoolByUsername(routeParam.arg, withInitialData, signal);
    default:
      return await fetchStakePool(routeParam.arg, withInitialData, signal);
  }
}
