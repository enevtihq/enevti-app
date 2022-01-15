import createSensitiveStorage from 'redux-persist-sensitive-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYCHAIN = 'enevtiKeychain';
const SHAREDPREFS = 'enevtiSharedPrefs';

const sensitiveStorage = createSensitiveStorage({
  keyChainService: KEYCHAIN,
  sharedPreferencesName: SHAREDPREFS,
});

export const asyncStoragePersistConfig = key => {
  return {
    key,
    storage: AsyncStorage,
  };
};

export const sensitiveStoragePersistConfig = key => {
  return {
    key,
    storage: sensitiveStorage,
  };
};
