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
  passphraseToPublicAndPrivateKey,
} from 'enevti-app/service/enevti/persona';
import { EncryptedData } from 'enevti-app/types/core/service/cryptography';
import { AnyAction } from '@reduxjs/toolkit';
import { updateFCMToken } from './fcm';

export const initPassphrase =
  (encryptedPassphrase: EncryptedData, plainPassphrase: string, localKey: string): AppThunk =>
  async dispatch => {
    dispatch(resetMyPersonaCache());
    dispatch(resetMyProfileCache());
    dispatch(setLocalSessionKey(localKey));
    dispatch(setEncryptedPassphraseAuth(encryptedPassphrase));
    dispatch(setMyPersonaBase32Cache(passphraseToBase32(plainPassphrase)));
    dispatch(setMyPersonaAddressCache(passphraseToAddress(plainPassphrase)));

    const publicKey = passphraseToPublicAndPrivateKey(plainPassphrase).publicKey;
    dispatch(updateFCMToken({ publicKey }) as unknown as AnyAction);
  };
