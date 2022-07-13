import { APIResponse } from 'enevti-app/types/core/service/api';
import { Moments } from 'enevti-app/types/core/service/feed';
import sleep from 'enevti-app/utils/dummy/sleep';

async function fetchMoments(signal?: AbortController['signal']): Promise<APIResponse<Moments>> {
  await sleep(1, signal);
  return { status: 200, meta: {}, data: [] };
}

export function parseMomentCache(moments: Moments) {
  return moments.slice(0, 10);
}

export async function getMoments(signal?: AbortController['signal'], _silent?: boolean): Promise<APIResponse<Moments>> {
  return await fetchMoments(signal);
}
