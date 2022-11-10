import { DecryptedData, DecryptedFile, EncryptedData, EncryptedFile } from 'enevti-app/types/core/service/cryptography';
import { encryptText_v1, decryptText_v1, encryptFile_v1, decryptFile_v1 } from './1';

interface AppCrypto {
  [key: number]: {
    encryptText: (plainText: string, password: string, iterations: number) => Promise<EncryptedData>;
    decryptText: (encryptedBase64: string, password: string) => Promise<DecryptedData>;
    encryptFile: (
      inputFile: string,
      outputFile: string,
      password: string,
      iterations: number,
    ) => Promise<EncryptedFile>;
    decryptFile: (
      inputFile: string,
      outputFile: string,
      password: string,
      iv: string,
      salt: string,
      iterations: number,
    ) => Promise<DecryptedFile>;
  };
}

export const appCrypto: AppCrypto = {
  1: {
    encryptText: encryptText_v1,
    decryptText: decryptText_v1,
    encryptFile: encryptFile_v1,
    decryptFile: decryptFile_v1,
  },
};
