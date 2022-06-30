export const ENEVTI_DEFAULT_API = 'http://18.224.8.86:8880';
export const ENEVTI_SERVICE_API = 'http://18.224.8.86:9901';
export const ENEVTI_FAUCET_API = 'http://18.224.8.86:8881';
export const ENEVTI_SOCKET_IO = 'ws://18.224.8.86:8082';
export const ENEVTI_CORE_WS = 'ws://18.224.8.86:8082/ws';
export const IPFS_GATEWAY = '.ipfs.nftstorage.link';
export const NFT_STORAGE_URL = 'https://api.nft.storage/upload';

type UrlGetTransactionsParam = {
  transactionId?: string;
  moduleAssetId?: string;
  moduleAssetName?: string;
  address?: string;
  senderAddress?: string;
  senderPublicKey?: string;
  senderUsername?: string;
  recipientAddress?: string;
  recipientPublicKey?: string;
  recipientUsername?: string;
  amount?: string;
  timestamp?: string;
  nonce?: string;
  blockId?: string;
  height?: string;
  search?: string;
  data?: string;
  limit?: string;
  offset?: string;
  includePending?: string;
  sort?: 'amount:asc' | 'amount:desc' | 'timestamp:asc' | 'timestamp:desc';
};

export function urlNFTStorage() {
  return NFT_STORAGE_URL;
}

export function urlWSCore() {
  return ENEVTI_CORE_WS;
}

export function urlSocketIO() {
  return ENEVTI_SOCKET_IO;
}

export function urlGetIPFS(hash: string, gateway: string = IPFS_GATEWAY) {
  return encodeURI(`https://${hash}${gateway}`);
}

export function urlGetStakeSent(
  param: { address?: string; username?: string; publicKey?: string },
  host: string = ENEVTI_SERVICE_API,
) {
  const query = new URLSearchParams(param).toString();
  return encodeURI(`${host}/api/v2/votes_sent?${query}`);
}

export function urlGetTransactions(param: UrlGetTransactionsParam, host: string = ENEVTI_SERVICE_API) {
  const query = new URLSearchParams(param).toString();
  return encodeURI(`${host}/api/v2/transactions?${query}`);
}

export function urlGetAllCollection(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection?offset=${offset}&limit=${limit}`);
}

export function urlGetAllNFT(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft?offset=${offset}&limit=${limit}`);
}

export function urlGetAllNFTTemplate(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/template?offset=${offset}&limit=${limit}`);
}

export function urlGetAllNFTTemplateGenesis(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/template/genesis?offset=${offset}&limit=${limit}`);
}

export function urlGetCollectionById(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/id/${id}`);
}

export function urlGetCollectionMintedNFTById(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/collection/id/${id}/minted?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetCollectionActivityById(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/collection/id/${id}/activity?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetCollectionByName(name: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/n/${name}`);
}

export function urlGetCollectionBySymbol(symbol: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/s/${symbol}`);
}

export function urlGetFeeds(
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/feeds/available?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetNFTById(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/id/${id}`);
}

export function urlGetNFTActivityById(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/nft/id/${id}/activity?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetNFTBySerial(serial: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/s/${serial}`);
}

export function urlGetNFTTemplateById(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/template/id/${id}`);
}

export function urlGetPersonaByAddress(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/persona/a/${address}`);
}

export function urlGetPersonaByUsername(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/persona/u/${username}`);
}

export function urlGetProfile(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}`);
}

export function urlGetProfileOwned(
  address: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/profile/${address}/owned?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetProfileCollection(
  address: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/profile/${address}/collection?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetProfileNonce(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}/nonce`);
}

export function urlGetProfileBalance(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}/balance`);
}

export function urlGetProfilePendingDelivery(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}/pending`);
}

export function urlGetStakePoolByAddress(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/stake/a/${address}`);
}

export function urlGetStaker(
  address: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/stake/a/${address}/staker?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetStakePoolByUsername(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/stake/u/${username}`);
}

export function urlGetIsNameExists(name: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/name/${name}`);
}

export function urlGetNameToCollectionId(name: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/name/${name}/id`);
}

export function urlGetIsSymbolExists(symbol: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/symbol/${symbol}`);
}

export function urlGetSymbolToCollectionId(symbol: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/symbol/${symbol}/id`);
}

export function urlGetIsSerialExists(serial: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/serial/${serial}`);
}

export function urlGetSerialToNFTId(serial: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/serial/${serial}/id`);
}

export function urlGetIsUsernameExists(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/username/${username}`);
}

export function urlGetUsernameToAddress(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/username/${username}/id`);
}

export function urlPostTransactionFee(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/transaction/dynamicBaseFee`);
}

export function urlPostTransaction(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/transaction/post`);
}

export function urlGetTransactionBaseFee(moduleID: number, assetID: number, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/transaction/basefee/${moduleID}/${assetID}`);
}

export function urlPostRequestFaucet(host: string = ENEVTI_FAUCET_API) {
  return encodeURI(`${host}/faucet`);
}

export function urlGetActivityProfile(
  address: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/activity/profile/${address}?offset=${offset}&limit=${limit}&version=${version}`);
}

export function urlGetWallet(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/wallet/${address}`);
}
