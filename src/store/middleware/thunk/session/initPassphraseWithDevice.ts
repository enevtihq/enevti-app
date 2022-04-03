import { AppThunk } from 'enevti-app/store/state';
import { setUnencryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import { resetMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';

export const initPassphraseWithDevice =
  (passphrase: string): AppThunk =>
  dispatch => {
    dispatch(setUnencryptedPassphraseAuth(passphrase));
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
  };
