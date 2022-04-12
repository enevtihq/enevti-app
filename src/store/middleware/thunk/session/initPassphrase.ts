import { AppThunk } from 'enevti-app/store/state';
import { setEncryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import {
  resetMyPersonaCache,
  setMyPersonaAddressCache,
  setMyPersonaBase32Cache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { setLocalSessionKey } from 'enevti-app/store/slices/session/local';
import {
  passphraseToBase32,
  passphraseToAddress,
} from 'enevti-app/service/enevti/persona';

export const initPassphrase =
  (passphrase: string, localKey: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setEncryptedPassphraseAuth(passphrase));
    dispatch(setLocalSessionKey(localKey));
    dispatch(setMyPersonaBase32Cache(passphraseToBase32(passphrase)));
    dispatch(setMyPersonaAddressCache(passphraseToAddress(passphrase)));
  };
