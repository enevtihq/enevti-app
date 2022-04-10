import { AppThunk } from 'enevti-app/store/state';
import { setEncryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import {
  resetMyPersonaCache,
  setMyPersonaAddressCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { setLocalSessionKey } from 'enevti-app/store/slices/session/local';
import { passphraseToAddress } from 'enevti-app/service/enevti/persona';

export const initPassphrase =
  (passphrase: string, localKey: string): AppThunk =>
  async dispatch => {
    dispatch(setMyPersonaAddressCache(passphraseToAddress(passphrase)));
    dispatch(setEncryptedPassphraseAuth(passphrase));
    dispatch(setLocalSessionKey(localKey));
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
  };
