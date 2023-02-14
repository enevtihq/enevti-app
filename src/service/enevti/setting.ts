import { ResponseJSON } from 'enevti-types/service/api';
import { urlGetIsUsernameExists } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode } from 'enevti-app/utils/error/handle';
import { appFetch, isInternetReachable } from 'enevti-app/utils/app/network';

export async function isUsernameAvailable(username: string, signal?: AbortController['signal']): Promise<boolean> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetIsUsernameExists(username), { signal });
    const ret = (await res.json()) as ResponseJSON<boolean>;
    handleResponseCode(res, ret);
    return !ret.data;
  } catch (err) {
    handleError(err);
    return false;
  }
}
