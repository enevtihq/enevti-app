import { Persona } from 'enevti-app/types/service/enevti/persona';
import { store } from 'enevti-app/store/state';
import {
  decryptWithDevice,
  decryptWithPassword,
} from 'enevti-app/utils/cryptography';
import * as Lisk from '@liskhq/lisk-client';
import { ERRORCODE } from 'enevti-app/utils/error/code';
import { sleep } from 'enevti-app/service/enevti/dummy';
import { lastFetchTreshold } from 'enevti-app/utils/constant/lastFetch';
import {
  setMyPersonaCache,
  setLastFetchMyPersonaCache,
  selectMyPersonaCache,
  setMyPersonaAddressCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { selectAuthState } from 'enevti-app/store/slices/auth';
import { selectLocalSession } from 'enevti-app/store/slices/session/local';

async function fetchPersona(
  address: string,
  signal?: AbortController['signal'],
): Promise<Persona> {
  await sleep(1000, signal);
  return {
    photo: '',
    address: address,
    username: 'aldhosutra',
  };
}

export async function getMyAddress() {
  const myPersona: Persona = selectMyPersonaCache(store.getState());
  if (myPersona.address) {
    return myPersona.address;
  } else {
    const auth = selectAuthState(store.getState());
    let authToken = auth.token;

    if (authToken && auth.encrypted) {
      const localKey = selectLocalSession(store.getState()).key;
      if (localKey) {
        authToken = (await decryptWithPassword(authToken, localKey)).data;
      } else {
        throw {
          name: 'KeyError',
          code: ERRORCODE.WRONG_LOCALKEY,
          message: 'Wrong Local Key',
        };
      }
    } else if (authToken && !auth.encrypted) {
      authToken = (await decryptWithDevice(authToken)).data;
    } else {
      throw {
        name: 'UnknownError',
        code: ERRORCODE.UNKNOWN,
        message: 'Unknown Error: persona.ts',
      };
    }

    const myAddress =
      Lisk.cryptography.getBase32AddressFromPassphrase(authToken);
    store.dispatch(setMyPersonaAddressCache(myAddress));

    return myAddress;
  }
}

export async function getBasePersona(
  address: string,
  signal?: AbortController['signal'],
): Promise<Persona> {
  return await fetchPersona(address, signal);
}

export async function getMyBasePersona(
  force = false,
  signal?: AbortController['signal'],
): Promise<Persona> {
  const now = Date.now();
  const address = await getMyAddress();
  const lastFetch = selectMyPersonaCache(store.getState()).lastFetch;
  let myPersona: Persona = selectMyPersonaCache(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.persona) {
    myPersona = await getBasePersona(address, signal);
    store.dispatch(setLastFetchMyPersonaCache(now));
    store.dispatch(setMyPersonaCache(myPersona));
  }

  return myPersona;
}
