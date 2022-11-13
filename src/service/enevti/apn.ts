import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import {
  urlDeleteAPNAddress,
  urlGetAPNIsAddressRegistered,
  urlGetAPNIsReady,
  urlPostAPNIsTokenUpdated,
  urlPostAPNRegisterAddress,
} from 'enevti-app/utils/constant/URLCreator';
import { createSignature } from 'enevti-app/utils/cryptography';
import { handleError, handleResponseCode, responseError } from 'enevti-app/utils/error/handle';
import { apiFetch, appFetch, isInternetReachable } from 'enevti-app/utils/app/network';

async function fetchAPNIsReady(signal?: AbortController['signal']): Promise<APIResponse<boolean>> {
  return await apiFetch<boolean>(urlGetAPNIsReady(), signal);
}

async function fetchAPNIsAddressRegistered(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<boolean>> {
  return await apiFetch<boolean>(urlGetAPNIsAddressRegistered(address), signal);
}

async function fetchAPNRegisterAddress(
  token: string,
  publicKey: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const signature = await createSignature(token);
    const res = await appFetch(urlPostAPNRegisterAddress(), {
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

async function fetchAPNIsTokenUpdated(
  address: string,
  token: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<boolean>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlPostAPNIsTokenUpdated(), {
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

async function fetchAPNDeleteAddress(
  address: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<string>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlDeleteAPNAddress(), {
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

export async function getAPNIsReady(signal?: AbortController['signal']) {
  return await fetchAPNIsReady(signal);
}

export async function getAPNIsAddressRegistered(address: string, signal?: AbortController['signal']) {
  return await fetchAPNIsAddressRegistered(address, signal);
}

export async function postAPNRegisterAddress(token: string, publicKey: string, signal?: AbortController['signal']) {
  return await fetchAPNRegisterAddress(token, publicKey, signal);
}

export async function getAPNIsTokenUpdated(address: string, token: string, signal?: AbortController['signal']) {
  return await fetchAPNIsTokenUpdated(address, token, signal);
}

export async function deleteAPNDeleteAddress(address: string, signal?: AbortController['signal']) {
  return await fetchAPNDeleteAddress(address, signal);
}
