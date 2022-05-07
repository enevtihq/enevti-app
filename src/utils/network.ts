import NetInfo from '@react-native-community/netinfo';
import i18n from 'enevti-app/translations/i18n';
import { PermissionsAndroid, Platform } from 'react-native';
import { lastFetchTimeout } from './constant/lastFetch';
import { ERRORCODE } from './error/code';
import io from 'socket.io-client';
import { urlSocketIO } from './constant/URLCreator';
import RNFetchBlob, { RNFetchBlobConfig } from 'rn-fetch-blob';

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

  const onAbort = () => clearTimeout(id);
  abortController.signal.addEventListener('abort', onAbort);

  const id = setTimeout(() => {
    abortController.abort();
  }, timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal,
    });
    abortController.abort();
    return response;
  } catch {
    abortController.abort();
    return new Response('{}', { status: 400 });
  }
}

export async function appFetchBlob(
  resource: string,
  options: RNFetchBlobConfig & {
    method?: 'GET' | 'POST' | 'PUT';
    headers?: Record<string, any>;
    filePath?: string;
    onUploadProgress?: (sent: number, total: number) => void;
    onDownloadProgress?: (received: number, total: number) => void;
    onBeginProgress?: () => void;
    onDoneProgress?: () => void;
    progressConfig?: { count?: number; interval?: number };
    signal?: AbortController['signal'];
  } = {},
) {
  if (Platform.OS === 'android') {
    if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE))) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw Error(i18n.t('error:permissionDenied'));
      }
    }
    if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw Error(i18n.t('error:permissionDenied'));
      }
    }
  }

  const {
    method,
    headers,
    filePath,
    onUploadProgress,
    onDownloadProgress,
    onBeginProgress,
    onDoneProgress,
    signal,
    progressConfig,
    ...config
  } = options;

  const pConfig = progressConfig ?? { count: 10 };

  const response = RNFetchBlob.config(config)
    .fetch(method ?? 'GET', resource, headers, filePath ? RNFetchBlob.wrap(filePath) : undefined)
    .uploadProgress(pConfig, onUploadProgress ? onUploadProgress : () => {})
    .progress(pConfig, onDownloadProgress ? onDownloadProgress : () => {});

  if (signal) {
    const onAbort = () => response.cancel(() => {});
    const fetchBlobSignal = multipleSignal([signal]);
    fetchBlobSignal.addEventListener('abort', onAbort);
  }

  onBeginProgress && onBeginProgress();
  const ret = await response;
  onDoneProgress && onDoneProgress();

  return ret;
}

export function appSocket() {
  return io(urlSocketIO(), { transports: ['websocket'] });
}
