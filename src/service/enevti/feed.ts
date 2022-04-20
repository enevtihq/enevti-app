import { Feeds } from 'enevti-app/types/core/service/feed';
import sleep from 'enevti-app/utils/dummy/sleep';
import { getDummyFeedItem } from './dummy';

async function fetchFeeds(signal?: AbortController['signal']): Promise<Feeds> {
  await sleep(1000, signal);

  let randomCount = Math.random() * 10;
  if (randomCount === 0) {
    randomCount = 1;
  }
  randomCount = 20;

  const randomFeed: Feeds = [];
  for (let i = 0; i < randomCount; i++) {
    randomFeed.push(getDummyFeedItem());
  }

  return randomFeed;
}

export function parseFeedCache(feeds: Feeds) {
  return feeds.slice(0, 10);
}

export async function getFeeds(
  signal?: AbortController['signal'],
): Promise<Feeds | undefined> {
  return await fetchFeeds(signal);
}
