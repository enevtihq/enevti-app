import { AppThunk } from '../../../state';
import { setEncryptedPassphraseAuth } from '../../../slices/auth';
import { resetMyPersonaCache } from '../../../slices/entities/cache/myPersona';
import { resetMyProfileCache } from '../../../slices/entities/cache/myProfile';
import { setLocalSessionKey } from '../../../slices/session/local';

export const initPassphrase =
  (passphrase: string, localKey: string): AppThunk =>
  dispatch => {
    dispatch(setEncryptedPassphraseAuth(passphrase));
    dispatch(setLocalSessionKey(localKey));
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
  };
