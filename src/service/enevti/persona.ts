import { Persona } from '../../types/service/enevti/persona';
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
  selectPersona,
} from '../../store/slices/entities/persona';

async function fetchMyPersona(address: string): Promise<Persona> {
  await sleep(5000);
  return {
    photo: '',
    address: address,
    username: 'aldhosutra',
  };
}

export async function getMyBasePersona(force = false): Promise<Persona> {
  const now = Date.now();
  const lastFetch = selectPersona(store.getState()).lastFetch;
  let myPersona: Persona = selectPersona(store.getState());

  if (force || now - lastFetch > lastFetchTreshold.persona) {
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
