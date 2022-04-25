import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import { Feeds } from 'enevti-app/types/core/service/feed';
import { urlGetFeeds } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { isInternetReachable } from 'enevti-app/utils/network';

async function fetchFeeds(signal?: AbortController['signal']): Promise<APIResponse<Feeds>> {
  try {
    await isInternetReachable();
    const res = await fetch(urlGetFeeds(), { signal });
    handleResponseCode(res);
    const ret = (await res.json()) as ResponseJSON<Feeds>;
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

export function parseFeedCache(feeds: Feeds) {
  return feeds.slice(0, 10);
}

export async function getFeeds(signal?: AbortController['signal']): Promise<APIResponse<Feeds>> {
  return await fetchFeeds(signal);
}
