import { ABORT_ERROR_MESSAGE } from 'enevti-app/utils/error/message';

export async function promiseWithSignal<T>(
  callback: () => Promise<T>,
  signal?: AbortController['signal'],
) {
  if (signal?.aborted) {
    return Promise.reject(new Error(ABORT_ERROR_MESSAGE));
  }
  return new Promise<T>(async (resolve, reject) => {
    const abortHandler = () => {
      reject(new Error(ABORT_ERROR_MESSAGE));
    };
    signal?.addEventListener('abort', abortHandler);

    const ret = await callback();
    resolve(ret);
    signal?.removeEventListener('abort', abortHandler);
  });
}
