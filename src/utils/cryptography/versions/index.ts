import { encryptText_v1, decryptText_v1, encryptFile_v1, decryptFile_v1 } from './1';

interface AppCrypto {
  [key: number]: {
    encryptText: (...rest: any) => any;
    decryptText: (...rest: any) => any;
    encryptFile: (...rest: any) => any;
    decryptFile: (...rest: any) => any;
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
