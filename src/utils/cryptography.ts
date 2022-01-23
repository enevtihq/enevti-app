import * as Lisk from '@liskhq/lisk-client';
import base64 from 'react-native-base64';
import DeviceInfo from 'react-native-device-info';

export const PBKDF2_ITERATION = 1000;
export type Encrypted = Lisk.cryptography.EncryptedPassphraseObject;

export function encryptWithPassword(
  text: string,
  password: string,
): Promise<string> {
  return new Promise(res =>
    setTimeout(() => {
      const encrypted = Lisk.cryptography.encryptPassphraseWithPassword(
        text,
        password,
        PBKDF2_ITERATION,
      );
      const base64Reps = base64.encode(JSON.stringify(encrypted));
      res(base64Reps);
    }, 1),
  );
}

export function decryptWithPassword(
  encryptedBase64: string,
  password: string,
): Promise<string> {
  return new Promise(res =>
    setTimeout(() => {
      const fromBase64 = JSON.parse(base64.decode(encryptedBase64));
      const decrypted = Lisk.cryptography.decryptPassphraseWithPassword(
        fromBase64,
        password,
      );
      res(decrypted);
    }, 1),
  );
}

export function encryptWithDevice(text: string): Promise<string> {
  return new Promise(res =>
    setTimeout(() => {
      const password = DeviceInfo.getUniqueId();
      const encrypted = Lisk.cryptography.encryptPassphraseWithPassword(
        text,
        password,
        PBKDF2_ITERATION,
      );
      const base64Reps = base64.encode(JSON.stringify(encrypted));
      res(base64Reps);
    }, 1),
  );
}

export function decryptWithDevice(encryptedBase64: string): Promise<string> {
  return new Promise(res =>
    setTimeout(() => {
      const fromBase64 = JSON.parse(base64.decode(encryptedBase64));
      const password = DeviceInfo.getUniqueId();
      const decrypted = Lisk.cryptography.decryptPassphraseWithPassword(
        fromBase64,
        password,
      );
      res(decrypted);
    }, 1),
  );
}
