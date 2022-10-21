import createSensitiveStorage from 'redux-persist-sensitive-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYCHAIN = 'enevtiKeychain';
const SHAREDPREFS = 'enevtiSharedPrefs';

export const sensitiveStorageOption = {
  keyChainService: KEYCHAIN,
  sharedPreferencesName: SHAREDPREFS,
};

const sensitiveStorage = createSensitiveStorage(sensitiveStorageOption);

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
