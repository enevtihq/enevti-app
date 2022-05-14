import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { urlGetFeeds } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';

type FeedResponse = { data: Feeds; offset: number };

async function fetchFeeds(signal?: AbortController['signal']): Promise<APIResponse<FeedResponse>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetFeeds(), { signal });
    const ret = (await res.json()) as ResponseJSON<FeedResponse>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, { data: [], offset: 0 });
  }
}

export function parseFeedCache(feeds: Feeds) {
  return feeds.slice(0, 10);
}

export async function getFeeds(signal?: AbortController['signal']): Promise<APIResponse<FeedResponse>> {
  return await fetchFeeds(signal);
}
