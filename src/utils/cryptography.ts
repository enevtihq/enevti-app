import * as Lisk from '@liskhq/lisk-client';
import base64 from 'react-native-base64';

export const PBKDF2_ITERATION = 10000;
export type Encrypted = Lisk.cryptography.EncryptedPassphraseObject;

export function encryptWithPassword(
  text: string,
  password: string,
): Promise<string> {
  return new Promise(res => {
    const encrypted = Lisk.cryptography.encryptPassphraseWithPassword(
      text,
      password,
      PBKDF2_ITERATION,
    );
    const base64Reps = base64.encode(JSON.stringify(encrypted));
    res(base64Reps);
  });
}

export function decryptWithPassword(
  encryptedBase64: string,
  password: string,
): Promise<string> {
  return new Promise(res => {
    const fromBase64 = JSON.parse(base64.decode(encryptedBase64));
    const decrypted = Lisk.cryptography.decryptPassphraseWithPassword(
      fromBase64,
      password,
    );
    res(decrypted);
  });
}
