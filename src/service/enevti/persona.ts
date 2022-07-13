import { Persona } from 'enevti-app/types/core/account/persona';
import { store } from 'enevti-app/store/state';
import { decryptWithDevice, decryptWithPassword } from 'enevti-app/utils/cryptography';
import * as Lisk from '@liskhq/lisk-client';
import { ERRORCODE } from 'enevti-app/utils/error/code';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import {
  setMyPersonaCache,
  setLastFetchMyPersonaCache,
  selectMyPersonaCache,
  setMyPersonaBase32Cache,
  setMyPersonaAddressCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { selectAuthState } from 'enevti-app/store/slices/auth';
import { selectLocalSession } from 'enevti-app/store/slices/session/local';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { appFetch, isInternetReachable } from 'enevti-app/utils/network';
import { urlGetPersonaByAddress, urlGetPersonaByUsername } from 'enevti-app/utils/constant/URLCreator';
import { handleError, handleResponseCode, isErrorResponse, responseError } from 'enevti-app/utils/error/handle';
import { APIResponse, ResponseJSON } from 'enevti-app/types/core/service/api';
import i18n from 'enevti-app/translations/i18n';

type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route']['params'];

const PREFIX = COIN_NAME.toLowerCase();
const PREFIX_MAX_LENGTH = 3;
const ENEVTI_BASE32_VALID_LENGTH = 42;

async function fetchPersona(address: string, signal?: AbortController['signal']): Promise<APIResponse<Persona>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetPersonaByAddress(address), { signal });
    const ret = (await res.json()) as ResponseJSON<Persona>;
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

async function fetchPersonaByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<APIResponse<Persona>> {
  try {
    await isInternetReachable();
    const res = await appFetch(urlGetPersonaByUsername(username), { signal });
    const ret = (await res.json()) as ResponseJSON<Persona>;
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

export function convertBase32Prefix(base32: string, oldPrefix: string, newPrefix: string): string {
  if (base32.substring(0, oldPrefix.length) === oldPrefix) {
    return `${newPrefix}${base32.substring(oldPrefix.length, base32.length)}`;
  } else {
    throw Error(i18n.t('error:invalidBase32Prefix'));
  }
}

export function parsePrefix(prefix: string): string {
  return PREFIX.length > PREFIX_MAX_LENGTH
    ? prefix.substring(prefix.length - PREFIX_MAX_LENGTH, prefix.length)
    : prefix;
}

export function parseBase32(base32: string): string {
  if (PREFIX.length > PREFIX_MAX_LENGTH && base32.substring(0, PREFIX.length) === PREFIX) {
    return convertBase32Prefix(base32, PREFIX, parsePrefix(PREFIX));
  } else {
    return base32;
  }
}

export function isValidBase32(base32: string): boolean {
  try {
    const ret =
      base32.substring(0, PREFIX.length) === PREFIX &&
      base32.length === ENEVTI_BASE32_VALID_LENGTH &&
      Lisk.cryptography.validateBase32Address(parseBase32(base32), parsePrefix(PREFIX));
    return ret;
  } catch {
    return false;
  }
}

export function isValidAddress(address: string): boolean {
  const base32 = addressToBase32(address);
  const validBase32 = isValidBase32(base32);
  return validBase32;
}

export function parsePersonaLabel(persona: Persona) {
  return persona.username ? persona.username : persona.base32 ? persona.base32 : '???';
}

export function addressToBase32(address: string) {
  return Lisk.cryptography.getBase32AddressFromAddress(Buffer.from(address, 'hex'), PREFIX);
}

export function base32ToAddress(base32: string) {
  return Lisk.cryptography.getAddressFromBase32Address(parseBase32(base32), parsePrefix(PREFIX)).toString('hex');
}

export function passphraseToBase32(passphrase: string) {
  return Lisk.cryptography.getBase32AddressFromPassphrase(passphrase, PREFIX);
}

export function passphraseToAddress(passphrase: string) {
  return Lisk.cryptography.getAddressFromPassphrase(passphrase).toString('hex');
}

export async function usernameToAddress(username: string) {
  const persona = await fetchPersonaByUsername(username);
  return persona.data.address;
}

export async function routeParamToAddress(routeParam: Record<string, any>) {
  return routeParam.mode === 'a'
    ? routeParam.arg
    : routeParam.mode === 'b'
    ? base32ToAddress(routeParam.arg)
    : routeParam.mode === 'u'
    ? await usernameToAddress(routeParam.arg)
    : routeParam.arg;
}

export async function getMyPassphrase() {
  const auth = selectAuthState(store.getState());
  let authToken = auth.token;

  if (authToken && auth.encrypted) {
    const localKey = selectLocalSession(store.getState()).key;
    if (localKey) {
      authToken = (await decryptWithPassword(authToken, localKey, auth.version)).data;
    } else {
      const err = Error(i18n.t('error:wrongLocalKey')) as any;
      err.name = 'KeyError';
      err.code = ERRORCODE.WRONG_LOCALKEY;
      throw err;
    }
  } else if (authToken && !auth.encrypted) {
    authToken = (await decryptWithDevice(authToken, auth.version)).data;
  } else {
    const err = Error(i18n.t('error:unknownErrorGetPassphrase')) as any;
    err.name = 'UnknownError';
    err.code = ERRORCODE.UNKNOWN;
    throw err;
  }
  return authToken;
}

export async function getMyPublicKey() {
  const passphrase = await getMyPassphrase();
  return Lisk.cryptography.getAddressAndPublicKeyFromPassphrase(passphrase).publicKey.toString('hex');
}

export async function getMyBase32() {
  const myPersona: Persona = selectMyPersonaCache(store.getState());
  if (myPersona.base32) {
    return myPersona.base32;
  } else {
    const myPassphrase = await getMyPassphrase();

    const myBase32 = passphraseToBase32(myPassphrase);
    store.dispatch(setMyPersonaBase32Cache(myBase32));

    return myBase32;
  }
}

export async function getMyAddress() {
  const myPersona: Persona = selectMyPersonaCache(store.getState());
  if (myPersona.address) {
    return myPersona.address;
  } else {
    const myPassphrase = await getMyPassphrase();

    const myAddress = passphraseToAddress(myPassphrase);
    store.dispatch(setMyPersonaAddressCache(myAddress));

    return myAddress;
  }
}

export async function getMyBase32AndAddress() {
  const address = await getMyAddress();
  const base32 = await getMyBase32();
  return {
    address,
    base32,
  };
}

export async function getBasePersona(address: string, signal?: AbortController['signal']) {
  return await fetchPersona(address, signal);
}

export async function getBasePersonaByUsername(username: string, signal?: AbortController['signal']) {
  return await fetchPersonaByUsername(username, signal);
}

export async function getBasePersonaByRouteParam(routeParam: ProfileRoute, signal?: AbortController['signal']) {
  switch (routeParam.mode) {
    case 'a':
      return await fetchPersona(routeParam.arg, signal);
    case 'b':
      const address = base32ToAddress(routeParam.arg);
      return await fetchPersona(address, signal);
    case 'u':
      return await fetchPersonaByUsername(routeParam.arg, signal);
    default:
      return await fetchPersona(routeParam.arg, signal);
  }
}

export async function getMyBasePersona(
  force = false,
  signal?: AbortController['signal'],
): Promise<APIResponse<Persona>> {
  const now = Date.now();
  const my = await getMyBase32AndAddress();
  const lastFetch = selectMyPersonaCache(store.getState()).lastFetch;
  let response: APIResponse<Persona> = {
    status: 200,
    data: selectMyPersonaCache(store.getState()),
    meta: {},
  };

  try {
    if (force || now - lastFetch > lastFetchTimeout.persona) {
      const res = await getBasePersona(my.address, signal);
      if (res.status === 200 && !isErrorResponse(res)) {
        response.data = res.data;
        store.dispatch(setLastFetchMyPersonaCache(now));
        store.dispatch(setMyPersonaCache(res.data as Persona));
      } else {
        response.status = res.status;
        response.data = res.data;
      }
    }
  } catch {}

  return response;
}
