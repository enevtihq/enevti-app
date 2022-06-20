import { addressToBase32, usernameToAddress } from 'enevti-app/service/enevti/persona';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { urlGetStakeSent, urlGetTransactions } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIServiceResponse, ServiceResponseJSON } from 'enevti-app/types/core/service/api';
import { WALLET_HISTORY_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { StakeSentService, TransactionServiceItem } from 'enevti-app/types/core/service/wallet';

type WalletRoute = StackScreenProps<RootStackParamList, 'Wallet'>['route']['params'];

async function fetchStakeSentByBase32(
  base32: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<StakeSentService>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetStakeSent({ address: base32 }), { signal });
    const ret = (await res.json()) as ServiceResponseJSON<StakeSentService>;
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

async function fetchStakeSentByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<StakeSentService>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetStakeSent({ username }), { signal });
    const ret = (await res.json()) as ServiceResponseJSON<StakeSentService>;
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

async function fetchTransactionHistoryByBase32(
  base32: string,
  offset: number,
  limit: number,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  try {
    await isInternetReachable();
    const res = await appFetch(
      urlGetTransactions({ address: base32, offset: offset.toString(), limit: limit.toString() }),
      { signal },
    );
    const ret = (await res.json()) as ServiceResponseJSON<TransactionServiceItem[]>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, {}, { count: 0, offset: 0, total: 0 });
  }
}

async function fetchTransactionHistoryByUsername(
  username: string,
  offset: number,
  limit: number,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  try {
    await isInternetReachable();
    const address = await usernameToAddress(username);
    const base32 = addressToBase32(address);
    const res = await appFetch(
      urlGetTransactions({ address: base32, offset: offset.toString(), limit: limit.toString() }),
      { signal },
    );
    const ret = (await res.json()) as ServiceResponseJSON<TransactionServiceItem[]>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, {}, { count: 0, offset: 0, total: 0 });
  }
}

export async function getStakeSentByBase32(
  base32: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<StakeSentService>> {
  return await fetchStakeSentByBase32(base32, signal);
}

export async function getStakeSentByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<StakeSentService>> {
  return await fetchStakeSentByUsername(username, signal);
}

export async function getTransactionHistoryByBase32(
  base32: string,
  offset: number,
  limit: number,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  return await fetchTransactionHistoryByBase32(base32, offset, limit, signal);
}

export async function getTransactionHistoryByUsername(
  username: string,
  offset: number,
  limit: number,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  return await fetchTransactionHistoryByUsername(username, offset, limit, signal);
}

export async function getInitialTransactionHistory(
  base32: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  return await fetchTransactionHistoryByBase32(base32, 0, WALLET_HISTORY_INITIAL_LENGTH, signal);
}

export async function getInitialTransactionHistoryByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIServiceResponse<TransactionServiceItem[]>> {
  return await fetchTransactionHistoryByUsername(username, 0, WALLET_HISTORY_INITIAL_LENGTH, signal);
}

export async function getStakeSentByRouteParam(routeParam: WalletRoute, signal?: AbortController['signal']) {
  let base32;
  switch (routeParam.mode) {
    case 'a':
      base32 = addressToBase32(routeParam.arg);
      return await getStakeSentByBase32(base32, signal);
    case 'b':
      return await getStakeSentByBase32(routeParam.arg, signal);
    case 'u':
      return await getStakeSentByUsername(routeParam.arg, signal);
    default:
      base32 = addressToBase32(routeParam.arg);
      return await getStakeSentByBase32(base32, signal);
  }
}

export async function getInitialTransactionHistoryByRouteParam(
  routeParam: WalletRoute,
  signal?: AbortController['signal'],
) {
  let base32;
  switch (routeParam.mode) {
    case 'a':
      base32 = addressToBase32(routeParam.arg);
      return await getInitialTransactionHistory(base32, signal);
    case 'b':
      return await getInitialTransactionHistory(routeParam.arg, signal);
    case 'u':
      return await getInitialTransactionHistoryByUsername(routeParam.arg, signal);
    default:
      base32 = addressToBase32(routeParam.arg);
      return await getInitialTransactionHistory(base32, signal);
  }
}

export async function getTransactionHistoryByRouteParam(
  routeParam: WalletRoute,
  offset: number,
  limit: number,
  signal?: AbortController['signal'],
) {
  let base32;
  switch (routeParam.mode) {
    case 'a':
      base32 = addressToBase32(routeParam.arg);
      return await getTransactionHistoryByBase32(base32, offset, limit, signal);
    case 'b':
      return await getTransactionHistoryByBase32(routeParam.arg, offset, limit, signal);
    case 'u':
      return await getTransactionHistoryByUsername(routeParam.arg, offset, limit, signal);
    default:
      base32 = addressToBase32(routeParam.arg);
      return await getTransactionHistoryByBase32(base32, offset, limit, signal);
  }
}
