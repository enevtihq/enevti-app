import { StakePoolData } from 'enevti-app/types/core/chain/stake';
import {
  getBasePersona,
  getBasePersonaByUsername,
  base32ToAddress,
} from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStakePoolStakerData } from './dummy';

type StakePoolRoute = StackScreenProps<RootStackParamList, 'StakePool'>['route']['params'];

async function fetchStakePool(
  address: string,
  signal?: AbortController['signal'],
): Promise<StakePoolData | undefined> {
  const persona = await getBasePersona(address, signal);

  return {
    owner: persona,
    staker: getStakePoolStakerData(),
  };
}

async function fetchStakePoolByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<StakePoolData | undefined> {
  const persona = await getBasePersonaByUsername(username, signal);

  return {
    owner: persona,
    staker: getStakePoolStakerData(),
  };
}

export async function getStakePoolData(
  address: string,
  signal?: AbortController['signal'],
): Promise<StakePoolData | undefined> {
  return await fetchStakePool(address, signal);
}

export async function getStakePoolDataByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<StakePoolData | undefined> {
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
