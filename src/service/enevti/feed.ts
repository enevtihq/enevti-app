import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { urlGetFeeds } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';

type FeedResponse = { data: Feeds; checkpoint: number; version: number };
const FEED_LIMIT_PER_REQ = 10;

async function fetchFeeds(
  signal?: AbortController['signal'],
  offset?: number,
  limit?: number,
  version?: number,
): Promise<APIResponse<FeedResponse>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetFeeds(offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<FeedResponse>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, { data: [], offset: 0, version: 0 });
  }
}

export function parseFeedCache(feeds: Feeds) {
  return feeds.slice(0, 10);
}

export async function getFeeds(signal?: AbortController['signal']): Promise<APIResponse<FeedResponse>> {
  return await fetchFeeds(signal);
}

export async function getMoreFeeds(
  offset: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponse<FeedResponse>> {
  return await fetchFeeds(signal, offset, FEED_LIMIT_PER_REQ, version);
}
