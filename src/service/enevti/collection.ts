import { StackScreenProps } from '@react-navigation/stack';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { RootStackParamList } from 'enevti-app/navigation';
import { urlGetCollectionById, urlGetCollectionBySymbol } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';

type CollectionRoute = StackScreenProps<RootStackParamList, 'Collection'>['route']['params'];

async function fetchCollectionById(id: string, signal?: AbortController['signal']): Promise<APIResponse<Collection>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionById(id), { signal });
    const ret = (await res.json()) as ResponseJSON<Collection>;
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

async function fetchCollectionBySymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Collection>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetCollectionBySymbol(symbol), { signal });
    const ret = (await res.json()) as ResponseJSON<Collection>;
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
