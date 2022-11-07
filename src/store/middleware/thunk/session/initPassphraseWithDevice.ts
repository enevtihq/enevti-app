import { AppThunk } from 'enevti-app/store/state';
import { setUnencryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import { resetMyPersonaCache, setMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import {
  passphraseToBase32,
  passphraseToAddress,
  passphraseToPublicAndPrivateKey,
} from 'enevti-app/service/enevti/persona';
import { EncryptedData } from 'enevti-app/types/core/service/cryptography';
import { updateFCMToken } from './fcm';
import { AnyAction } from '@reduxjs/toolkit';
import { updateAPNToken } from './apn';
import { setMyPublicKeyCache } from 'enevti-app/store/slices/entities/cache/myPublicKey';

export const initPassphraseWithDevice =
  (encryptedPassphrase: EncryptedData, plainPassphrase: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setUnencryptedPassphraseAuth(encryptedPassphrase));
    dispatch(
      setMyPersonaCache({ base32: passphraseToBase32(plainPassphrase), address: passphraseToAddress(plainPassphrase) }),
    );

    const publicKey = passphraseToPublicAndPrivateKey(plainPassphrase).publicKey;
    dispatch(setMyPublicKeyCache(publicKey));

    dispatch(updateFCMToken({ publicKey }) as unknown as AnyAction);
    dispatch(updateAPNToken({ publicKey }) as unknown as AnyAction);
  };
