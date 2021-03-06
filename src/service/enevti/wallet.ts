import { base32ToAddress, usernameToAddress } from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { urlGetActivityProfile, urlGetWallet } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, APIResponseVersioned, ResponseJSON, ResponseVersioned } from 'enevti-app/types/core/service/api';
import { WALLET_HISTORY_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { WalletView } from 'enevti-app/types/core/service/wallet';

type WalletRoute = StackScreenProps<RootStackParamList, 'Wallet'>['route']['params'];

async function fetchWallet(address: string, signal?: AbortController['signal']): Promise<APIResponse<WalletView>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetWallet(address), { signal });
    const ret = (await res.json()) as ResponseJSON<WalletView>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code);
  }
}

async function fetchTransactionHistory(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<WalletView['history']>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetActivityProfile(address, offset, limit, version), { signal });
    const ret = (await res.json()) as ResponseJSON<ResponseVersioned<WalletView['history']>>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code);
  }
}

export async function getWallet(address: string, signal?: AbortController['signal']): Promise<APIResponse<WalletView>> {
  return await fetchWallet(address, signal);
}

export async function getTransactionHistory(
  address: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<WalletView['history']>> {
  return await fetchTransactionHistory(address, offset, limit, version, signal);
}

export async function getInitialTransactionHistory(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<WalletView['history']>> {
  return await fetchTransactionHistory(address, 0, WALLET_HISTORY_INITIAL_LENGTH, 0, signal);
}

export async function getWalletByRouteParam(routeParam: WalletRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'a':
      return await getWallet(routeParam.arg, signal);
    case 'b':
      return await getWallet(base32ToAddress(routeParam.arg), signal);
    case 'u':
      return await getWallet(await usernameToAddress(routeParam.arg), signal);
    default:
      return await getWallet(routeParam.arg, signal);
  }
}

export async function getTransactionHistoryByRouteParam(
  routeParam: WalletRoute,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 'a':
      return await getTransactionHistory(routeParam.arg, offset, limit, version, signal);
    case 'b':
      return await getTransactionHistory(base32ToAddress(routeParam.arg), offset, limit, version, signal);
    case 'u':
      return await getTransactionHistory(await usernameToAddress(routeParam.arg), offset, limit, version, signal);
    default:
      return await getTransactionHistory(routeParam.arg, offset, limit, version, signal);
  }
}

export async function getInitialTransactionHistoryByRouteParam(
  routeParam: WalletRoute,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 'a':
      return await getInitialTransactionHistory(routeParam.arg, signal);
    case 'b':
      return await getInitialTransactionHistory(base32ToAddress(routeParam.arg), signal);
    case 'u':
      return await getInitialTransactionHistory(await usernameToAddress(routeParam.arg), signal);
    default:
      return await getInitialTransactionHistory(routeParam.arg, signal);
  }
}
