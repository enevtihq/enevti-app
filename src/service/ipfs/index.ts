import { urlGetIPFS, urlNFTStorage } from 'enevti-app/utils/constant/URLCreator';
import Config from 'react-native-config';
import { appFetchBlob } from 'enevti-app/utils/network';
import i18n from 'enevti-app/translations/i18n';
import * as Hash from 'ipfs-only-hash';

export const IPFStoURL = (hash: string) => urlGetIPFS(hash);

export const getIPFSCID = async (input: string | Buffer) => {
  const cid = await Hash.of(input, { cidVersion: 1, rawLeaves: true });
  return cid;
};

export async function uploadURItoIPFS(uri: string, signal?: AbortController['signal']) {
  if (!Config.NFT_STORAGE_API_KEY) {
    throw Error(i18n.t('error:nftStorageAPIKeyUndefined'));
  }

  const result = await appFetchBlob(urlNFTStorage(), {
    method: 'POST',
    filePath: uri,
    headers: {
      Authorization: `Bearer ${Config.NFT_STORAGE_API_KEY}`,
    },
    signal,
  });

  const resJson = result.json();

  if (resJson.ok) {
    return resJson.value.cid;
  } else {
    throw Error(resJson.error.message);
  }
}
