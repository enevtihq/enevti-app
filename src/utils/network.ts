import NetInfo from '@react-native-community/netinfo';
import i18n from 'enevti-app/translations/i18n';
import { lastFetchTimeout } from './constant/lastFetch';
import { ERRORCODE } from './error/code';
import io from 'socket.io-client';
import { urlSocketIO } from './constant/URLCreator';
import ReactNativeBlobUtil, { ReactNativeBlobUtilConfig } from 'react-native-blob-util';
import { checkPermissionStorage } from './permission';

export async function isInternetReachable(): Promise<boolean> {
  await i18n.loadNamespaces('network');
  const status = (await NetInfo.fetch()).isInternetReachable;
  if (!status) {
    const err = Error(i18n.t('network:noInternet')) as any;
    err.name = 'NetworkError';
    err.code = ERRORCODE.NETWORK_ERROR;
    throw err;
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
  options: ReactNativeBlobUtilConfig & {
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
  await checkPermissionStorage();

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

  const response = ReactNativeBlobUtil.config(config)
    .fetch(method ?? 'GET', resource, headers, filePath ? ReactNativeBlobUtil.wrap(filePath) : undefined)
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

export function appSocket(room?: string) {
  const socket = io(urlSocketIO(), { transports: ['websocket'] });
  if (room) {
    socket.on('connect', () => {
      socket.emit('register', room);
    });
  }
  return socket;
}
