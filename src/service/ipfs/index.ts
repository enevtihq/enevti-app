import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import sleep from 'enevti-app/utils/dummy/sleep';

const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';

export const IPFStoURL = (hash: string) => IPFS_GATEWAY + hash;

export async function uploadURItoIPFS(uri: string, signal?: AbortController['signal']) {
  await sleep(5000, signal);
  return makeDummyIPFS();
}
