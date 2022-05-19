export const ENEVTI_DEFAULT_API = 'http://192.168.0.104:8880';
export const ENEVTI_FAUCET_API = 'http://192.168.0.104:8881';
export const ENEVTI_SOCKET_IO = 'ws://192.168.0.104:8082';
export const ENEVTI_CORE_WS = 'ws://192.168.0.104:8082/ws';
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';
export const NFT_STORAGE_URL = 'https://api.nft.storage/upload';

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
  return encodeURI(`${gateway}${hash}`);
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

export function urlGetCollectionByName(name: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/n/${name}`);
}

export function urlGetCollectionBySymbol(symbol: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/s/${symbol}`);
}

export function urlGetFeeds(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/feeds/available?offset=${offset}&limit=${limit}`);
}

export function urlGetNFTById(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/id/${id}`);
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

export function urlGetProfileNonce(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}/nonce`);
}

export function urlGetProfilePendingDelivery(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/profile/${address}/pending`);
}

export function urlGetStakePoolByAddress(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/stake/a/${address}`);
}

export function urlGetStakePoolByUsername(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/stake/u/${username}`);
}

export function urlGetIsNameExists(name: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/name/${name}`);
}

export function urlGetIsSymbolExists(symbol: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/symbol/${symbol}`);
}

export function urlGetIsSerialExists(serial: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/serial/${serial}`);
}

export function urlGetIsUsernameExists(username: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/registrar/username/${username}`);
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
