import { PersonaBase } from '../../types/service/enevti/persona';
import { store } from '../../store/state';
import {
  decryptWithDevice,
  decryptWithPassword,
} from '../../utils/cryptography';
import * as Lisk from '@liskhq/lisk-client';
import { ERRORCODE } from '../../utils/error/code';
import { sleep } from '../../service/enevti/dummy';
import { lastFetchTreshold } from '../../utils/lastFetch/constant';
import {
  setPersona,
  setLastFetchPersona,
} from '../../store/slices/entities/persona';

async function fetchMyPersona(address: string): Promise<PersonaBase> {
  await sleep(5000);
  return {
    photo: '',
    address: address,
    username: 'aldhosutra',
  };
}

export async function getMyBasePersona(force = false): Promise<PersonaBase> {
  const now = Date.now();
  const lastFetch = store.getState().entities.persona.lastFetch;
  let myPersona: PersonaBase = store.getState().entities.persona;

  if (force || now - lastFetch > lastFetchTreshold) {
    let authToken = store.getState().auth.token;

    if (authToken && store.getState().auth.encrypted) {
      const localKey = store.getState().session.local.key;
      if (localKey) {
        authToken = (await decryptWithPassword(authToken, localKey)).data;
      } else {
        throw {
          name: 'KeyError',
          code: ERRORCODE.WRONG_LOCALKEY,
          message: 'Wrong Local Key',
        };
      }
    } else if (authToken && !store.getState().auth.encrypted) {
      authToken = (await decryptWithDevice(authToken)).data;
    } else {
      throw {
        name: 'UnknownError',
        code: ERRORCODE.UNKNOWN,
        message: 'Unknown Error: persona.ts',
      };
    }

    const address = Lisk.cryptography.getBase32AddressFromPassphrase(authToken);

    myPersona = await fetchMyPersona(address);

    store.dispatch(setLastFetchPersona(now));
    store.dispatch(setPersona(myPersona));
  }

  return myPersona;
}
