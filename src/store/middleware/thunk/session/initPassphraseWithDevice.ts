import { AppThunk } from 'enevti-app/store/state';
import { setUnencryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import {
  resetMyPersonaCache,
  setMyPersonaAddressCache,
  setMyPersonaBase32Cache,
} from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { passphraseToBase32, passphraseToAddress } from 'enevti-app/service/enevti/persona';
import { EncryptedData } from 'enevti-app/types/core/service/cryptography';

export const initPassphraseWithDevice =
  (encryptedPassphrase: EncryptedData, plainPassphrase: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setUnencryptedPassphraseAuth(encryptedPassphrase));
    dispatch(setMyPersonaBase32Cache(passphraseToBase32(plainPassphrase)));
    dispatch(setMyPersonaAddressCache(passphraseToAddress(plainPassphrase)));
  };
