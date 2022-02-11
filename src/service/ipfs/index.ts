const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';

export const IPFStoURL = (hash: string) => IPFS_GATEWAY + hash;
