import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import userSettingReducer from './slices/userSetting';
import sessionReducer from './slices/session';
import { persistReducer } from 'redux-persist';
import {
  asyncStoragePersistConfig,
  sensitiveStoragePersistConfig,
} from './persist/config';

const rootReducer = combineReducers({
  auth: persistReducer(sensitiveStoragePersistConfig('auth'), authReducer),
  session: sessionReducer,
  userSetting: persistReducer(
    asyncStoragePersistConfig('userSetting'),
    userSettingReducer,
  ),
});

export default persistReducer(
  asyncStoragePersistConfig('root', ['session']),
  rootReducer,
);
