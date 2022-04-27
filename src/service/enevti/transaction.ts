import { urlPostTransactionFee } from 'enevti-app/utils/constant/URLCreator';
import { getMyPassphrase, getMyPublicKey, getMyAddress } from './persona';
import { getProfileNonce } from './profile';
import { isInternetReachable } from 'enevti-app/utils/network';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import base64 from 'react-native-base64';
import i18n from 'enevti-app/translations/i18n';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';

export async function calculateGasFee(
  payload: AppTransaction<any>,
  signal?: AbortController['signal'],
): Promise<string | undefined> {
  try {
    const transaction = await createTransaction(payload.moduleID, payload.assetID, payload);
    const minFeeResponse = await fecthTransactionMinFee(transaction, signal);
    if (minFeeResponse.status !== 200) {
      throw Error(i18n.t('errorFetchMinFee', { msg: minFeeResponse.data }));
    }
    return minFeeResponse.data.toString();
  } catch (err) {
    handleError(err);
    return undefined;
  }
}

export async function fecthTransactionMinFee(
  payload: any,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const passphrase = await getMyPassphrase();
    const res = await fetch(urlPostTransactionFee(), {
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
    return responseError(err.code);
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
