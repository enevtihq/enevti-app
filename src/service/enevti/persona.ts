import { Persona } from '../../types/service/enevti/persona';
import { store } from '../../store/state';
import {
  decryptWithDevice,
  decryptWithPassword,
} from '../../utils/cryptography';
import * as Lisk from '@liskhq/lisk-client';
import { ERRORCODE } from '../../utils/error/code';
import { sleep } from '../../service/enevti/dummy';
import { lastFetchTreshold } from '../../utils/constant/lastFetch';
import {
  setMyPersona,
  setLastFetchMyPersona,
  selectMyPersona,
  setMyPersonaAddress,
} from '../../store/slices/entities/myPersona';
import { selectAuthState } from '../../store/slices/auth';
import { selectLocalSession } from '../../store/slices/session/local';

async function fetchPersona(address: string): Promise<Persona> {
  await sleep(5000);
  return {
    photo: '',
    address: address,
    username: 'aldhosutra',
  };
}

export async function getMyAddress() {
  const myPersona: Persona = selectMyPersona(store.getState());
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
    store.dispatch(setMyPersonaAddress(myAddress));

    return myAddress;
  }
}

export async function getBasePersona(
  address: string,
  force = false,
): Promise<Persona> {
  const now = Date.now();
  const lastFetch = selectMyPersona(store.getState()).lastFetch;
  let myPersona: Persona = selectMyPersona(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.persona) {
    myPersona = await fetchPersona(address);

    store.dispatch(setLastFetchMyPersona(now));
    store.dispatch(setMyPersona(myPersona));
  }

  return myPersona;
}

export async function getMyBasePersona(force = false): Promise<Persona> {
  const address = await getMyAddress();
  return await getBasePersona(address, force);
}
