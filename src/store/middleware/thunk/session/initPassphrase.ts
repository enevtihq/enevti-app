import { AppThunk } from 'enevti-app/store/state';
import { setEncryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import { resetMyPersonaCache, setMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { resetMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { setLocalSessionKey } from 'enevti-app/store/slices/session/local';
import {
  passphraseToBase32,
  passphraseToAddress,
  passphraseToPublicAndPrivateKey,
} from 'enevti-app/service/enevti/persona';
import { EncryptedData } from 'enevti-app/types/utils/cryptography';
import { AnyAction } from '@reduxjs/toolkit';
import { updateFCMToken } from './fcm';
import { updateAPNToken } from './apn';
import { setMyPublicKeyCache } from 'enevti-app/store/slices/entities/cache/myPublicKey';

export const initPassphrase =
  (encryptedPassphrase: EncryptedData, plainPassphrase: string, localKey: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setLocalSessionKey(localKey));
    dispatch(setEncryptedPassphraseAuth(encryptedPassphrase));
    dispatch(
      setMyPersonaCache({ base32: passphraseToBase32(plainPassphrase), address: passphraseToAddress(plainPassphrase) }),
    );

    const publicKey = passphraseToPublicAndPrivateKey(plainPassphrase).publicKey;
    dispatch(setMyPublicKeyCache(publicKey));

    dispatch(updateFCMToken({ publicKey }) as unknown as AnyAction);
    dispatch(updateAPNToken({ publicKey }) as unknown as AnyAction);
  };
