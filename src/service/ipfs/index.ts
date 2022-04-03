/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';

const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';

export const IPFStoURL = (hash: string) => IPFS_GATEWAY + hash;

export async function uploadURItoIPFS(uri: string) {
  await new Promise(r => setTimeout(r, 5000));
  return makeDummyIPFS();
}
