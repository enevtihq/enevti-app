import { StackScreenProps } from '@react-navigation/stack';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { RootStackParamList } from 'enevti-app/navigation';
import sleep from 'enevti-app/utils/dummy/sleep';
import { getDummyCollectionFullData } from './dummy';

type CollectionRoute = StackScreenProps<
  RootStackParamList,
  'Collection'
>['route']['params'];

async function fetchCollectionById(
  id: string,
  signal?: AbortController['signal'],
): Promise<Collection | undefined> {
  await sleep(1000, signal);

  const ret = getDummyCollectionFullData();
  ret.id = id;

  return ret;
}

async function fetchCollectionBySymbol(
  symbol: string,
  signal?: AbortController['signal'],
): Promise<Collection | undefined> {
  await sleep(1000, signal);

  const ret = getDummyCollectionFullData();
  ret.symbol = symbol;

  return ret;
}

export async function getCollectionById(
  id: string,
  signal?: AbortController['signal'],
): Promise<Collection | undefined> {
  return await fetchCollectionById(id, signal);
}

export async function getCollectionByRouteParam(
  routeParam: CollectionRoute,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 's':
      return await fetchCollectionBySymbol(routeParam.arg, signal);
    case 'id':
      return await fetchCollectionById(routeParam.arg, signal);
    default:
      return await fetchCollectionById(routeParam.arg, signal);
  }
}
