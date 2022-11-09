import createSensitiveStorage from 'redux-persist-sensitive-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MMKVStorage from './mmkv-storage';

const KEYCHAIN = 'enevtiKeychain';
const SHAREDPREFS = 'enevtiSharedPrefs';

export const sensitiveStorageOption = {
  keyChainService: KEYCHAIN,
  sharedPreferencesName: SHAREDPREFS,
};

const sensitiveStorage = createSensitiveStorage(sensitiveStorageOption);

export const mmkvStoragePersistConfig = (key: string, blacklist?: string[]) => {
  return {
    key,
    blacklist,
    storage: MMKVStorage,
  };
};

export const asyncStoragePersistConfig = (key: string, blacklist?: string[]) => {
  return {
    key,
    blacklist,
    storage: AsyncStorage,
  };
};

export const sensitiveStoragePersistConfig = (key: string) => {
  return {
    key,
    storage: sensitiveStorage,
  };
};
