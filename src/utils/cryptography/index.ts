import * as Lisk from '@liskhq/lisk-client';
import base64 from 'react-native-base64';
import DeviceInfo from 'react-native-device-info';
import { getMyPassphrase } from 'enevti-app/service/enevti/persona';
import { trimExtension } from 'enevti-app/utils/format/directory';
import {
  DecryptedData,
  DecryptedFile,
  EncryptedData,
  EncryptedFile,
} from 'enevti-app/types/core/service/cryptography';
import { appCrypto } from './versions';
import i18n from 'enevti-app/translations/i18n';

const LATEST_VERSION = 1;
const SUPPORTED_VERSION = [1];

export const ENCRYPTED_FILE_EXTENSION = 'enc';
export const PBKDF2_ITERATION = 1000;

export async function encryptWithPassword(
  text: string,
  password: string,
  version: number = LATEST_VERSION,
): Promise<EncryptedData> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  return await appCrypto[version].encryptText(text, password, PBKDF2_ITERATION);
}

export async function decryptWithPassword(
  encryptedBase64: string,
  password: string,
  version: number,
): Promise<DecryptedData> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  try {
    const ret = await appCrypto[version].decryptText(encryptedBase64, password);
    return ret;
  } catch (err: any) {
    return {
      status: 'error',
      data: err.message,
    };
  }
}

export async function encryptWithDevice(
  text: string,
  version: number = LATEST_VERSION,
): Promise<EncryptedData> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  const password = DeviceInfo.getUniqueId();
  return await appCrypto[version].encryptText(text, password, PBKDF2_ITERATION);
}

export async function decryptWithDevice(
  encryptedBase64: string,
  version: number,
): Promise<DecryptedData> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  try {
    const password = DeviceInfo.getUniqueId();
    const ret = await appCrypto[version].decryptText(encryptedBase64, password);
    return ret;
  } catch (err: any) {
    return {
      status: 'error',
      data: err.message,
    };
  }
}

export async function encryptFile(
  inputFile: string,
  password: string,
  version: number = LATEST_VERSION,
  outputFile?: string,
): Promise<EncryptedFile> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  const outputPath = outputFile ? outputFile : `${inputFile}.${ENCRYPTED_FILE_EXTENSION}`;
  return await appCrypto[version].encryptFile(inputFile, outputPath, password);
}

export async function decryptFile(
  inputFile: string,
  password: string,
  iv: string,
  salt: string,
  version: number,
  outputFile?: string,
): Promise<DecryptedFile> {
  if (!SUPPORTED_VERSION.includes(version)) {
    throw Error(i18n.t('error:unsupportedCryptoVersion'));
  }
  const outputPath = outputFile
    ? outputFile
    : `${trimExtension(inputFile, ENCRYPTED_FILE_EXTENSION)}`;
  return await appCrypto[version].decryptFile(inputFile, outputPath, password, iv, salt);
}

export async function createSignature(data: any): Promise<string> {
  const passphrase = await getMyPassphrase();
  return Lisk.cryptography.signData(Buffer.from(data, 'hex'), passphrase).toString('hex');
}

export async function verifySignature(data: string, signature: string, signer: string) {
  return Lisk.cryptography.verifyData(
    Buffer.from(data, 'hex'),
    Buffer.from(signature, 'hex'),
    Buffer.from(signer, 'hex'),
  );
}

export async function encryptAsymmetric(message: string, recipientPublicKey: string) {
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
    ) as Lisk.cryptography.EncryptedMessageWithNonce;
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
