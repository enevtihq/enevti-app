import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import { urlPostUserMeta } from 'enevti-app/utils/constant/URLCreator';
import { createSignature } from 'enevti-app/utils/cryptography';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/app/network';
import { Platform } from 'react-native';
import { getMyPublicKey } from './persona';

type EnevtiUserMeta = {
  locale: string;
  os: typeof Platform.OS;
};

async function fetchSetUserMeta(
  metaObj: EnevtiUserMeta,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const publicKey = await getMyPublicKey();
    const meta = JSON.stringify(metaObj);
    const signature = await createSignature(meta);
    const res = await appFetch(urlPostUserMeta(), {
      signal,
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ publicKey, meta, signature }),
    });
    const ret = (await res.json()) as ResponseJSON<string>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, err.message.toString());
  }
}

export async function postSetUserMeta(meta: EnevtiUserMeta, signal?: AbortController['signal']) {
  return await fetchSetUserMeta(meta, signal);
}
