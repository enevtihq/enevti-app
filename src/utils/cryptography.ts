import * as Lisk from '@liskhq/lisk-client';
import base64 from 'react-native-base64';
import DeviceInfo from 'react-native-device-info';
import { getMyPassphrase } from 'enevti-app/service/enevti/persona';
import RNEncryptionModule from '@dhairyasharma/react-native-encryption';
import { trimExtension } from './format/directory';

export const ENCRYPTED_FILE_EXTENSION = 'enc';
export const PBKDF2_ITERATION = 1000;
export type Encrypted = Lisk.cryptography.EncryptedPassphraseObject;
export type EncryptedWithNonce = Lisk.cryptography.EncryptedMessageWithNonce;

export interface DecryptedData {
  status: 'success' | 'error';
  data: string;
}

interface EncryptedFile {
  status: 'success' | 'error';
  iv: string;
  salt: string;
}

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
): Promise<DecryptedData> {
  return new Promise(res =>
    setTimeout(() => {
      try {
        const fromBase64 = JSON.parse(base64.decode(encryptedBase64));
        const decrypted = Lisk.cryptography.decryptPassphraseWithPassword(
          fromBase64,
          password,
        );
        res({
          status: 'success',
          data: decrypted,
        });
      } catch (err: any) {
        res({
          status: 'error',
          data: err.message,
        });
      }
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

export function decryptWithDevice(
  encryptedBase64: string,
): Promise<DecryptedData> {
  return new Promise(res =>
    setTimeout(() => {
      try {
        const fromBase64 = JSON.parse(base64.decode(encryptedBase64));
        const password = DeviceInfo.getUniqueId();
        const decrypted = Lisk.cryptography.decryptPassphraseWithPassword(
          fromBase64,
          password,
        );
        res({
          status: 'success',
          data: decrypted,
        });
      } catch (err: any) {
        res({
          status: 'error',
          data: err.message,
        });
      }
    }, 1),
  );
}

export async function createSignature(data: any): Promise<string> {
  const passphrase = await getMyPassphrase();
  return Lisk.cryptography
    .signData(Buffer.from(data, 'hex'), passphrase)
    .toString('hex');
}

export async function verifySignature(
  data: string,
  signature: string,
  signer: string,
) {
  return Lisk.cryptography.verifyData(
    Buffer.from(data, 'hex'),
    Buffer.from(signature, 'hex'),
    Buffer.from(signer, 'hex'),
  );
}

export async function encryptAsymmetric(
  message: string,
  recipientPublicKey: string,
) {
  const passphrase = await getMyPassphrase();
  const encrypted = Lisk.cryptography.encryptMessageWithPassphrase(
    message,
    passphrase,
    Buffer.from(recipientPublicKey, 'hex'),
  );
  return base64.encode(JSON.stringify(encrypted));
}

export async function decryptAsymmetric(
  encryptedBase64: string,
  senderPublicKey: string,
): Promise<DecryptedData> {
  try {
    const fromBase64 = JSON.parse(
      base64.decode(encryptedBase64),
    ) as EncryptedWithNonce;
    const passphrase = await getMyPassphrase();
    const data = Lisk.cryptography.decryptMessageWithPassphrase(
      fromBase64.encryptedMessage,
      fromBase64.nonce,
      passphrase,
      Buffer.from(senderPublicKey, 'hex'),
    );
    return { status: 'success', data: data };
  } catch (err: any) {
    return { status: 'error', data: err.message };
  }
}

export async function encryptFile(
  inputFile: string,
  password: string,
  outputFile?: string,
): Promise<EncryptedFile> {
  const outputPath = outputFile
    ? outputFile
    : `${inputFile}.${ENCRYPTED_FILE_EXTENSION}`;
  const ret = await RNEncryptionModule.encryptFile(
    inputFile,
    outputPath,
    password,
  );
  if (ret.status === 'success') {
    return {
      status: ret.status,
      iv: ret.iv,
      salt: ret.salt,
    };
  } else {
    return {
      status: 'error',
      iv: '',
      salt: '',
    };
  }
}

export async function decryptFile(
  inputFile: string,
  password: string,
  iv: string,
  salt: string,
  outputFile?: string,
) {
  const outputPath = outputFile
    ? outputFile
    : `${trimExtension(inputFile, ENCRYPTED_FILE_EXTENSION)}`;
  const ret = await RNEncryptionModule.decryptFile(
    inputFile,
    outputPath,
    password,
    iv,
    salt,
  );
  if (ret.status === 'success') {
    return { status: 'success' };
  } else {
    return { status: 'error' };
  }
}
