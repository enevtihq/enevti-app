export interface EncryptedBase {
  iterations: number;
  cipherText: string;
  iv: string;
  salt: string;
  tag: string;
  version: number;
}

export interface EncryptedData {
  status: 'success' | 'error' | '';
  data: string;
  version: number;
}

export interface DecryptedData {
  status: 'success' | 'error' | '';
  data: string;
}

export interface EncryptedFile {
  status: 'success' | 'error' | '';
  output: string;
  iv: string;
  salt: string;
  version: number;
}

export type DecryptedFile = DecryptedData;
