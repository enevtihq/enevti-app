type ReduxPersistSensitiveStorageOption = {
  keyChainService: string;
  sharedPreferencesName: string;
};

declare module 'redux-persist-sensitive-storage' {
  export default function createSensitiveStorage(option: ReduxPersistSensitiveStorageOption): any;
}
