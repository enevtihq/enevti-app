import RNEncryptionModule from '@dhairyasharma/react-native-encryption';
import base64 from 'react-native-base64';
import {
  EncryptedBase,
  EncryptedData,
  DecryptedData,
  EncryptedFile,
  DecryptedFile,
} from 'enevti-app/types/core/service/cryptography';
import sleep from 'enevti-app/utils/dummy/sleep';

const VERSION = 1;

export async function encryptText_v1(plainText: string, password: string, iterations: number): Promise<EncryptedData> {
  await sleep(1);
  const encrypted = await RNEncryptionModule.encryptText(plainText, password, iterations);
  const ret: EncryptedBase = {
    iterations: iterations,
    cipherText: encrypted.encryptedText,
    iv: encrypted.iv,
    salt: encrypted.salt,
    tag: '',
    version: VERSION,
  };
  const base64Reps = base64.encode(JSON.stringify(ret));
  return {
    status: 'success',
    data: base64Reps,
    version: VERSION,
  };
}

export async function decryptText_v1(encryptedBase64: string, password: string): Promise<DecryptedData> {
  await sleep(1);
  const fromBase64 = JSON.parse(base64.decode(encryptedBase64)) as EncryptedBase;
  const decrypted = await RNEncryptionModule.decryptText(
    fromBase64.cipherText,
    password,
    fromBase64.iv,
    fromBase64.salt,
    fromBase64.iterations,
  );
  if (decrypted.status === 'success' && decrypted.decryptedText) {
    return {
      status: 'success',
      data: decrypted.decryptedText,
    };
  } else {
    return {
      status: 'error',
      data: '',
    };
  }
}

export async function encryptFile_v1(
  inputFile: string,
  outputFile: string,
  password: string,
  iterations: number,
): Promise<EncryptedFile> {
  await sleep(1);
  const ret = await RNEncryptionModule.encryptFile(inputFile, outputFile, password, iterations);
  if (ret.status === 'success') {
    return {
      status: 'success',
      output: outputFile,
      security: `${ret.iv}:${ret.salt}:${iterations}:${VERSION}`,
    };
  } else {
    return {
      status: 'error',
      output: '',
      security: '',
    };
  }
}

export async function decryptFile_v1(
  inputFile: string,
  outputFile: string,
  password: string,
  iv: string,
  salt: string,
  iterations: number,
): Promise<DecryptedFile> {
  await sleep(1);
  const ret = await RNEncryptionModule.decryptFile(inputFile, outputFile, password, iv, salt, iterations);
  if (ret.status === 'success') {
    return {
      status: 'success',
      data: outputFile,
    };
  } else {
    return {
      status: 'error',
      data: '',
    };
  }
}
