import { ProfileAPIVersion } from 'enevti-app/types/core/account/profile';
import { APIResponse, APIResponseVersionRoot } from 'enevti-app/types/core/service/api';
import { Feeds, HomeFeeds, Moments } from 'enevti-app/types/core/service/feed';
import { HOME_FEED_LIMIT } from 'enevti-app/utils/constant/limit';
import { urlGetFeeds, urlGetHome } from 'enevti-app/utils/constant/URLCreator';
import { apiFetch, apiFetchVersionRoot } from 'enevti-app/utils/app/network';
import { getMyAddress } from './persona';

type FeedResponse = { data: Feeds; checkpoint: number; version: number };
export const FEED_CACHE_MAX_LENGTH = HOME_FEED_LIMIT;
const FEED_LIMIT_PER_REQ = HOME_FEED_LIMIT;

async function fetchHome(
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponseVersionRoot<HomeFeeds, { profile: ProfileAPIVersion; feed: number; moment: number }>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersionRoot<HomeFeeds, { profile: ProfileAPIVersion; feed: number; moment: number }>(
    urlGetHome(myAddress),
    signal,
    silent,
    { data: [], offset: 0, version: 0 },
  );
}

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

export function parseMomentCache(moments: Moments) {
  return moments.slice(0, 10);
}

export async function getHome(
  signal?: AbortController['signal'],
  silent?: boolean,
): Promise<APIResponseVersionRoot<HomeFeeds, { profile: ProfileAPIVersion; feed: number; moment: number }>> {
  return await fetchHome(signal, silent);
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
