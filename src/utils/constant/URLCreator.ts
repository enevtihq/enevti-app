export const ENEVTI_DEFAULT_API = 'http://192.168.0.105:8880';
export const ENEVTI_SERVICE_API = 'http://192.168.0.105:9901';
export const ENEVTI_FAUCET_API = 'http://192.168.0.105:8881';
export const ENEVTI_SOCKET_IO = 'ws://192.168.0.105:8082';
export const ENEVTI_VIDEOCALL_SOCKET = 'ws://192.168.0.105:8083';
export const ENEVTI_CORE_WS = 'ws://192.168.0.105:8082/ws';
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

export function makeUrl(url: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}${url}`);
}

export function urlNFTStorage() {
  return NFT_STORAGE_URL;
}

export function urlWSCore() {
  return ENEVTI_CORE_WS;
}

export function urlSocketIO() {
  return ENEVTI_SOCKET_IO;
}

export function urlVideoCallSocketIO() {
  return ENEVTI_VIDEOCALL_SOCKET;
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

export function urlGetAllCollection(
  offset: number = 0,
  limit: number = 10,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/collection?offset=${offset}&limit=${limit}&viewer=${viewer}`);
}

export function urlGetAllNFT(
  offset: number = 0,
  limit: number = 10,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/nft?offset=${offset}&limit=${limit}&viewer=${viewer}`);
}

export function urlGetAllNFTTemplate(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/template?offset=${offset}&limit=${limit}`);
}

export function urlGetAllNFTTemplateGenesis(offset: number = 0, limit: number = 10, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/template/genesis?offset=${offset}&limit=${limit}`);
}

export function urlGetIsCollectionOwnerOrCreator(id: string, address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/authorized/collection/${id}?address=${address}`);
}

export function urlGetCollectionById(id: string, viewer: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/id/${id}?viewer=${viewer}`);
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

export function urlGetCollectionByName(name: string, viewer: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/n/${name}?viewer=${viewer}`);
}

export function urlGetCollectionBySymbol(symbol: string, viewer: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/collection/s/${symbol}?viewer=${viewer}`);
}

export function urlGetFeeds(
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/feeds/available?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`);
}

export function urlGetIsNFTOwnerOrCreator(id: string, address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/authorized/nft/${id}?address=${address}`);
}

export function urlGetNFTById(id: string, viewer: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/id/${id}?viewer=${viewer}`);
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

export function urlGetNFTBySerial(serial: string, viewer: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/nft/s/${serial}?viewer=${viewer}`);
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

export function urlGetTransactionById(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/transaction/${id}`);
}

export function urlGetTransactionStatus(id: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/transaction/${id}/status`);
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

export function urlGetCommentCollection(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(
    `${host}/comment/collection/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`,
  );
}

export function urlGetCommentClubsCollection(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(
    `${host}/comment/collection/clubs/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`,
  );
}

export function urlGetCommentNFT(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/comment/nft/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`);
}

export function urlGetCommentClubsNFT(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(
    `${host}/comment/nft/clubs/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`,
  );
}

export function urlGetReplyComment(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(`${host}/reply/comment/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`);
}

export function urlGetReplyCommentClubs(
  id: string,
  offset: number = 0,
  limit: number = 10,
  version: number = 0,
  viewer: string,
  host: string = ENEVTI_DEFAULT_API,
) {
  return encodeURI(
    `${host}/reply/comment/clubs/${id}?offset=${offset}&limit=${limit}&version=${version}&viewer=${viewer}`,
  );
}

export function urlGetTagUsername(query: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/tag/username?q=${query}`);
}

export function urlGetTagCollection(query: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/tag/collection?q=${query}`);
}

export function urlGetTagNFT(query: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/tag/nft?q=${encodeURIComponent(query)}`);
}

export function urlGetConfigSocialRaffle(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/config/raffle`);
}

export function urlGetFCMIsReady(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/fcm/ready`);
}

export function urlGetFCMIsAddressRegistered(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/fcm/registered/${address}`);
}

export function urlPostFCMRegisterAddress(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/fcm/register`);
}

export function urlDeleteFCMAddress(host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/fcm/remove`);
}

export function urlGetAvatarUrl(address: string, host: string = ENEVTI_DEFAULT_API) {
  return encodeURI(`${host}/avatar/url/${address}`);
}
