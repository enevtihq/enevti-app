import { AbortError } from 'enevti-app/utils/error/type';

export default async function sleep(time: number, signal?: AbortController['signal']) {
  await new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      return reject(AbortError);
    }
    const timeout = setTimeout(resolve, time);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(AbortError);
    });
  });
}
