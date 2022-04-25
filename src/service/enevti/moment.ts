import { Moments } from 'enevti-app/types/core/service/feed';
import sleep from 'enevti-app/utils/dummy/sleep';

async function fetchMoments(signal?: AbortController['signal']): Promise<Moments> {
  await sleep(1, signal);
  return [];
}

export function parseMomentCache(moments: Moments) {
  return moments.slice(0, 10);
}

export async function getMoments(signal?: AbortController['signal']): Promise<Moments | undefined> {
  return await fetchMoments(signal);
}
