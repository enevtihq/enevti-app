import { AppThunk } from 'enevti-app/store/state';
import { setUnencryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import {
  resetMyPersonaCache,
  setMyPersonaAddressCache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { passphraseToAddress } from 'enevti-app/service/enevti/persona';

export const initPassphraseWithDevice =
  (passphrase: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setUnencryptedPassphraseAuth(passphrase));
    dispatch(setMyPersonaAddressCache(passphraseToAddress(passphrase)));
  };
