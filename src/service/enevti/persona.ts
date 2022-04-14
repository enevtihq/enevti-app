import { Persona } from 'enevti-app/types/service/enevti/persona';
import { store } from 'enevti-app/store/state';
import {
  decryptWithDevice,
  decryptWithPassword,
} from 'enevti-app/utils/cryptography';
import * as Lisk from '@liskhq/lisk-client';
import { ERRORCODE } from 'enevti-app/utils/error/code';
import sleep from 'enevti-app/utils/dummy/sleep';
import { lastFetchTreshold } from 'enevti-app/utils/constant/lastFetch';
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

type ProfileRoute = StackScreenProps<
  RootStackParamList,
  'Profile'
>['route']['params'];

async function fetchPersona(
  address: string,
  signal?: AbortController['signal'],
): Promise<Persona> {
  await sleep(1000, signal);
  return {
    photo: '',
    address: address,
    base32: addressToBase32(address),
    username: 'aldhosutra',
  };
}

async function fetchPersonaByUsername(
  username: string,
  signal?: AbortController['signal'],
): Promise<Persona> {
  await sleep(1000, signal);
  return {
    photo: '',
    address: '3d4a6ef61ba235dc60c7a5fdb2c775138cb00b51',
    base32: addressToBase32('3d4a6ef61ba235dc60c7a5fdb2c775138cb00b51'),
    username: username,
  };
}

export function addressToBase32(address: string) {
  return Lisk.cryptography.getBase32AddressFromAddress(
    Buffer.from(address, 'hex'),
  );
}

export function base32ToAddress(base32: string) {
  return Lisk.cryptography.getAddressFromBase32Address(base32).toString('hex');
}

export function passphraseToBase32(passphrase: string) {
  return Lisk.cryptography.getBase32AddressFromPassphrase(passphrase);
}

export function passphraseToAddress(passphrase: string) {
  return Lisk.cryptography.getAddressFromPassphrase(passphrase).toString('hex');
}

export async function getMyPassphrase() {
  const auth = selectAuthState(store.getState());
  let authToken = auth.token;

  if (authToken && auth.encrypted) {
    const localKey = selectLocalSession(store.getState()).key;
    if (localKey) {
      authToken = (await decryptWithPassword(authToken, localKey, auth.version))
        .data;
    } else {
      throw {
        name: 'KeyError',
        code: ERRORCODE.WRONG_LOCALKEY,
        message: 'Wrong Local Key',
      };
    }
  } else if (authToken && !auth.encrypted) {
    authToken = (await decryptWithDevice(authToken, auth.version)).data;
  } else {
    throw {
      name: 'UnknownError',
      code: ERRORCODE.UNKNOWN,
      message: 'Unknown Error: persona.ts',
    };
  }
  return authToken;
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

export async function getBasePersona(
  address: string,
  signal?: AbortController['signal'],
): Promise<Persona> {
  return await fetchPersona(address, signal);
}

export async function getBasePersonaByUsername(
  username: string,
  signal?: AbortController['signal'],
) {
  return await fetchPersonaByUsername(username, signal);
}

export async function getBasePersonaByRouteParam(
  routeParam: ProfileRoute,
  signal?: AbortController['signal'],
) {
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
): Promise<Persona> {
  const now = Date.now();
  const my = await getMyBase32AndAddress();
  const lastFetch = selectMyPersonaCache(store.getState()).lastFetch;
  let myPersona: Persona = selectMyPersonaCache(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.persona) {
    myPersona = await getBasePersona(my.address, signal);
    store.dispatch(setLastFetchMyPersonaCache(now));
    store.dispatch(setMyPersonaCache(myPersona));
  }

  return myPersona;
}
