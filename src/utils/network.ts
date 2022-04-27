import NetInfo from '@react-native-community/netinfo';
import i18n from 'enevti-app/translations/i18n';
import { lastFetchTimeout } from './constant/lastFetch';
import { ERRORCODE } from './error/code';
import { handleError } from './error/handle';

export async function isInternetReachable(): Promise<boolean> {
  await i18n.loadNamespaces('network');
  const status = (await NetInfo.fetch()).isInternetReachable;
  if (!status) {
    throw {
      name: 'NetworkError',
      code: ERRORCODE.NETWORK_ERROR,
      message: i18n.t('network:noInternet'),
    };
  }
  return status ? status : false;
}

export function multipleSignal(signals: AbortController['signal'][]) {
  const controller = new AbortController();

  function onAbort() {
    controller.abort();
    for (const signal of signals) {
      signal.removeEventListener('abort', onAbort);
    }
  }

  for (const signal of signals) {
    if (signal.aborted) {
      onAbort();
      break;
    }
    signal.addEventListener('abort', onAbort);
  }

  return controller.signal;
}

export async function appFetch(resource: string, options: Record<string, any> = {}) {
  const { timeout = lastFetchTimeout.request } = options;

  const abortController = new AbortController();
  const signalArray = [abortController.signal];
  options.signal ? signalArray.push(options.signal) : {};
  const signal = multipleSignal(signalArray);

  const id = setTimeout(() => {
    abortController.abort();
    handleError({ message: i18n.t('error:timeoutError') });
  }, timeout);
  const response = await fetch(resource, {
    ...options,
    signal,
  });

  clearTimeout(id);
  return response;
}
