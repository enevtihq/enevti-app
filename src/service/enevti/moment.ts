import { Moments } from 'enevti-app/types/service/enevti/feed';
import sleep from 'enevti-app/utils/dummy/sleep';
import { getDummyMomentItem } from './dummy';

async function fetchMoments(
  signal?: AbortController['signal'],
): Promise<Moments> {
  await sleep(3000, signal);

  let randomCount = Math.random() * 10;
  if (randomCount === 1) {
    randomCount = 0;
  }

  const randomMoments: Moments = [];
  for (let i = 0; i < randomCount; i++) {
    randomMoments.push(getDummyMomentItem());
  }

  return randomMoments;
}

export function parseMomentCache(moments: Moments) {
  return moments.slice(0, 10);
}

export async function getMoments(
  signal?: AbortController['signal'],
): Promise<Moments | undefined> {
  return fetchMoments(signal);
}
