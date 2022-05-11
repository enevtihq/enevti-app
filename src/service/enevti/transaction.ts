import {
  urlGetTransactionBaseFee,
  urlPostTransaction,
  urlPostTransactionFee,
} from 'enevti-app/utils/constant/URLCreator';
import { getMyPassphrase, getMyPublicKey, getMyAddress } from './persona';
import { getProfileNonce } from './profile';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import base64 from 'react-native-base64';
import i18n from 'enevti-app/translations/i18n';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';

export async function postTransaction<T>(
  payload: AppTransaction<T>,
  signal?: AbortController['signal'],
): Promise<APIResponse<any>> {
  try {
    const postTransactionResponse = await fecthPostTransaction(payload, signal);
    if (postTransactionResponse.status !== 200) {
      throw postTransactionResponse;
    }
    return postTransactionResponse;
  } catch (err: any) {
    handleError(err, 'data');
    return err;
  }
}

export async function calculateGasFee(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const transaction = await createTransaction(payload.moduleID, payload.assetID, payload.asset, payload.fee, signal);
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

export async function createTransaction<T>(
  moduleID: number,
  assetID: number,
  asset: T,
  fee: string = '0',
  signal?: AbortController['signal'],
): Promise<AppTransaction<T>> {
  const publicKey = await getMyPublicKey();
  const myAddress = await getMyAddress();
  const nonce = await getProfileNonce(myAddress, signal);
  if (nonce.status !== 200) {
    throw Error(i18n.t('error:requestNonceFailed'));
  }
  return {
    moduleID,
    assetID,
    asset,
    fee,
    nonce: nonce.data,
    senderPublicKey: publicKey,
  };
}

export function attachFee(transaction: AppTransaction<any>, fee: string) {
  return {
    ...transaction,
    fee,
  };
}
