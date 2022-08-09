import { APIResponse } from 'enevti-app/types/core/service/api';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { urlGetFeeds } from 'enevti-app/utils/constant/URLCreator';
import { apiFetch } from 'enevti-app/utils/network';
import { getMyAddress } from './persona';

type FeedResponse = { data: Feeds; checkpoint: number; version: number };
export const FEED_CACHE_MAX_LENGTH = 10;
const FEED_LIMIT_PER_REQ = 10;

async function fetchFeeds(
  signal?: AbortController['signal'],
  offset?: number,
  limit?: number,
  version?: number,
  silent?: boolean,
): Promise<APIResponse<FeedResponse>> {
  const myAddress = await getMyAddress();
  return await apiFetch<FeedResponse>(urlGetFeeds(offset, limit, version, myAddress), signal, silent, {
    data: [],
    offset: 0,
    version: 0,
  });
}

export function parseFeedCache(feeds: Feeds) {
  return feeds.slice(0, FEED_CACHE_MAX_LENGTH);
}

export async function getFeeds(
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponse<FeedResponse>> {
  return await fetchFeeds(signal, undefined, undefined, undefined, silent);
}

export async function getMoreFeeds(
  offset: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponse<FeedResponse>> {
  return await fetchFeeds(signal, offset, FEED_LIMIT_PER_REQ, version);
}
