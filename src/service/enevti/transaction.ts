import {
  urlGetTransactionBaseFee,
  urlGetTransactionById,
  urlGetTransactionStatus,
  urlPostTransaction,
  urlPostTransactionFee,
} from 'enevti-app/utils/constant/URLCreator';
import { getMyAddress, getMyPassphrase, getMyPublicKey } from './persona';
import { appFetch, isInternetReachable } from 'enevti-app/utils/app/network';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-types/service/api';
import base64 from 'react-native-base64';
import i18n from 'enevti-app/translations/i18n';
import { AppTransaction } from 'enevti-types/service/transaction';
import { store } from 'enevti-app/store/state';
import {
  selectTransactionNonce,
  addTransactionNonceCache,
  isTransactionNonceSynced,
  setTransactionNonceCacheState,
} from 'enevti-app/store/slices/entities/cache/transactionNonce';
import { getProfileNonce } from './profile';
import { selectProcessedTransactionThisBlock } from 'enevti-app/store/slices/session/transaction/processedThisBlock';
import { MAX_TRANSACTION_PER_ACCOUNT } from 'enevti-app/utils/constant/identifier';
import awaitNewBlock from 'enevti-app/utils/chain/awaitNewBlock';
import { TransactionStatus } from 'enevti-types/service/transaction';

export async function postTransaction<T>(
  payload: AppTransaction<T>,
  signal?: AbortController['signal'],
  silent: boolean = false,
): Promise<APIResponse<any>> {
  try {
    const response = await processTransaction<T>(payload, signal, silent);
    if (response.status === 200) {
      store.dispatch(addTransactionNonceCache());
    }
    return response;
  } catch (err: any) {
    return err;
  }
}

export async function postSilentTransaction<T>(
  payload: AppTransaction<T>,
  signal?: AbortController['signal'],
): Promise<APIResponse<any>> {
  try {
    return await processTransaction<T>(payload, signal);
  } catch (err: any) {
    handleError(err, undefined, true);
    return err;
  }
}

export async function processTransaction<T>(
  payload: AppTransaction<T>,
  signal?: AbortController['signal'],
  silent: boolean = false,
): Promise<APIResponse<any>> {
  try {
    const postTransactionResponse = await fecthPostTransaction(payload, signal);
    if (postTransactionResponse.status !== 200) {
      throw postTransactionResponse;
    }
    return postTransactionResponse;
  } catch (err: any) {
    handleError(err, 'data', silent);
    return err;
  }
}

export async function calculateMinGasFee(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const transaction = payload;
    const minFeeResponse = await fecthTransactionMinFee(transaction, signal);
    if (minFeeResponse.status !== 200) {
      throw Error(i18n.t('error:errorFetchMinFee', { msg: minFeeResponse.data }));
    }
    return BigInt(minFeeResponse.data).toString();
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function calculateGasFee(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const minFee = await calculateMinGasFee(payload, signal);
    return minFee ? (BigInt(minFee) * BigInt(2)).toString() : undefined;
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function calculateGasFeeLow(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const minFee = await calculateMinGasFee(payload, signal);
    return minFee ? BigInt(minFee).toString() : undefined;
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function calculateGasFeeHigh(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const minFee = await calculateMinGasFee(payload, signal);
    return minFee ? (BigInt(minFee) * BigInt(3)).toString() : undefined;
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function calculateBaseFee(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const baseFeeResponse = await fecthTransactionBaseFee(payload.moduleID, payload.assetID, signal);
    if (baseFeeResponse.status !== 200) {
      throw Error(i18n.t('error:errorFetchBaseFee', { msg: baseFeeResponse.data }));
    }
    return baseFeeResponse.data.toString();
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function fecthPostTransaction(
  payload: any,
  signal?: AbortController['signal'],
): Promise<APIResponse<Record<string, any>>> {
  try {
    await isInternetReachable();
    const passphrase = await getMyPassphrase();
    const processedThisBlock = selectProcessedTransactionThisBlock(store.getState());
    if (processedThisBlock > (await MAX_TRANSACTION_PER_ACCOUNT())) {
      await awaitNewBlock();
    }
    const res = await appFetch(urlPostTransaction(), {
      signal,
      method: 'POST',
      headers: new Headers({
        Authorization: 'Basic ' + base64.encode(`:${passphrase}`),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ payload }),
    });
    const ret = (await res.json()) as ResponseJSON<Record<string, any>>;
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

export async function fecthTransactionMinFee(
  payload: any,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const passphrase = await getMyPassphrase();
    const res = await appFetch(urlPostTransactionFee(), {
      signal,
      method: 'POST',
      headers: new Headers({
        Authorization: 'Basic ' + base64.encode(`:${passphrase}`),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ payload }),
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

export async function fecthTransactionBaseFee(
  moduleID: number,
  assetID: number,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTransactionBaseFee(moduleID, assetID), { signal });
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

async function fecthTransactionById(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Record<string, any>>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTransactionById(id), { signal });
    const ret = (await res.json()) as ResponseJSON<Record<string, any>>;
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

async function fecthTransactionStatus(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<TransactionStatus>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetTransactionStatus(id), { signal });
    const ret = (await res.json()) as ResponseJSON<TransactionStatus>;
    handleResponseCode(res, ret);
    return {
      status: res.status,
      data: ret.data,
      meta: ret.meta,
    };
  } catch (err: any) {
    handleError(err);
    return responseError(err.code, 'not-found');
  }
}

export async function getTransactionById(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Record<string, any>>> {
  return await fecthTransactionById(id, signal);
}

export async function getTransactionStatus(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<TransactionStatus>> {
  return await fecthTransactionStatus(id, signal);
}

export async function createTransaction<T>(
  moduleID: number,
  assetID: number,
  asset: T,
  fee: string = '0',
  signal?: AbortController['signal'],
): Promise<AppTransaction<T>> {
  const publicKey = await getMyPublicKey();
  let nonce = '0';
  const nonceSynced = isTransactionNonceSynced(store.getState());
  if (nonceSynced) {
    nonce = selectTransactionNonce(store.getState()).toString();
  } else {
    nonce = await updateNonceCache(signal);
  }
  return {
    moduleID,
    assetID,
    asset,
    fee,
    nonce,
    senderPublicKey: publicKey,
  };
}

export async function createSilentTransaction<T>(
  moduleID: number,
  assetID: number,
  asset: T,
  fee: string = '0',
  signal?: AbortController['signal'],
): Promise<AppTransaction<T>> {
  const transaction = await createTransaction(moduleID, assetID, asset, fee, signal);
  return transaction;
}

export async function updateNonceCache(signal?: AbortController['signal'], silent?: boolean) {
  let nonce = '0';
  const myAddress = await getMyAddress();
  const profileNonce = await getProfileNonce(myAddress, signal, silent);
  if (profileNonce.status === 200) {
    nonce = profileNonce.data;
    store.dispatch(setTransactionNonceCacheState({ value: Number(profileNonce.data), synced: true }));
  } else {
    throw Error(i18n.t('error:requestNonceFailed'));
  }
  return nonce;
}

export function attachFee(transaction: AppTransaction<any>, fee: string) {
  return {
    ...transaction,
    fee,
  };
}

export function attachNonce(transaction: AppTransaction<any>, nonce: string) {
  return {
    ...transaction,
    nonce,
  };
}
