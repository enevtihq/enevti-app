import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import {
  urlDeleteFCMAddress,
  urlGetFCMIsAddressRegistered,
  urlGetFCMIsReady,
  urlPostFCMIsTokenUpdated,
  urlPostFCMRegisterAddress,
} from 'enevti-app/utils/constant/URLCreator';
import { createSignature } from 'enevti-app/utils/cryptography';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { apiFetch, appFetch, isInternetReachable } from 'enevti-app/utils/app/network';

async function fetchFCMIsReady(signal?: AbortController['signal']): Promise<APIResponse<boolean>> {
  return await apiFetch<boolean>(urlGetFCMIsReady(), signal);
}

async function fetchFCMIsAddressRegistered(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<boolean>> {
  return await apiFetch<boolean>(urlGetFCMIsAddressRegistered(address), signal);
}

async function fetchFCMRegisterAddress(
  token: string,
  publicKey: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const signature = await createSignature(token);
    const res = await appFetch(urlPostFCMRegisterAddress(), {
      signal,
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ publicKey, token, signature }),
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

async function fetchFCMIsTokenUpdated(
  address: string,
  token: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<boolean>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlPostFCMIsTokenUpdated(), {
      signal,
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ address, token }),
    });
    const ret = (await res.json()) as ResponseJSON<boolean>;
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

async function fetchFCMDeleteAddress(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlDeleteFCMAddress(), {
      signal,
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ address }),
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

export async function getFCMIsReady(signal?: AbortController['signal']) {
  return await fetchFCMIsReady(signal);
}

export async function getFCMIsAddressRegistered(address: string, signal?: AbortController['signal']) {
  return await fetchFCMIsAddressRegistered(address, signal);
}

export async function postFCMRegisterAddress(token: string, publicKey: string, signal?: AbortController['signal']) {
  return await fetchFCMRegisterAddress(token, publicKey, signal);
}

export async function getFCMIsTokenUpdated(address: string, token: string, signal?: AbortController['signal']) {
  return await fetchFCMIsTokenUpdated(address, token, signal);
}

export async function deleteFCMDeleteAddress(address: string, signal?: AbortController['signal']) {
  return await fetchFCMDeleteAddress(address, signal);
}
