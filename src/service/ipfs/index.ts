import { urlGetIPFS } from 'enevti-app/utils/constant/URLCreator';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import sleep from 'enevti-app/utils/dummy/sleep';

export const IPFStoURL = (hash: string) => urlGetIPFS(hash);

export async function uploadURItoIPFS(uri: string, signal?: AbortController['signal']) {
  await sleep(5000, signal);
  return makeDummyIPFS();
}
