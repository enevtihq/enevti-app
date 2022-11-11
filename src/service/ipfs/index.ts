import {
  urlGetIPFS,
  urlGetIPFSImageResized,
  urlNFTStorage,
  urlWeb3Storage,
} from 'enevti-app/utils/constant/URLCreator';
import Config from 'react-native-config';
import { appFetch, appFetchBlob, isInternetReachable } from 'enevti-app/utils/network';
import i18n from 'enevti-app/translations/i18n';
import * as Hash from 'ipfs-only-hash';
import { handleError } from 'enevti-app/utils/error/handle';
import { SizeCode } from 'enevti-app/types/core/service/api';

export const IPFStoURL = (hash: string) => urlGetIPFS(hash);

export const IPFSImagetoURL = (hash: string, size: SizeCode = 'og') => urlGetIPFSImageResized(hash, size);

export const getIPFSCID = async (input: string | Buffer) => {
  const cid = await Hash.of(input, { cidVersion: 1, rawLeaves: true });
  return cid;
};

export const fetchIPFS = async (cid: string, signal?: AbortController['signal']) => {
  try {
    await isInternetReachable();
    const res = await appFetch(IPFStoURL(cid), { signal });
    const ret = await res.text();
    if (res.status === 200) {
      return ret;
    } else {
      return undefined;
    }
  } catch (err) {
    handleError(err);
    return undefined;
  }
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

export async function uploadTextToIPFS(text: string, signal?: AbortController['signal']) {
  if (!Config.WEB3_STORAGE_API_KEY) {
    throw Error(i18n.t('error:web3StorageAPIKeyUndefined'));
  }

  const result = await appFetchBlob(urlWeb3Storage(), {
    method: 'POST',
    fileBody: text,
    headers: {
      Authorization: `Bearer ${Config.WEB3_STORAGE_API_KEY}`,
    },
    signal,
  });

  const resJson = result.json();
  return resJson.cid as string;
}
