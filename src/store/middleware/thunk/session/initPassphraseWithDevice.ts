import { AppThunk } from '../../../state';
import { setUnencryptedPassphraseAuth } from '../../../slices/auth';
import { resetMyPersonaCache } from '../../../slices/entities/cache/myPersona';
import { resetMyProfileCache } from '../../../slices/entities/cache/myProfile';

export const initPassphraseWithDevice =
  (passphrase: string): AppThunk =>
  dispatch => {
    dispatch(setUnencryptedPassphraseAuth(passphrase));
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
  };
