import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import entitiesReducer from './slices/entities';
import userSettingReducer from './slices/userSetting';
import sessionReducer from './slices/session/';
import UIReducer from './slices/ui';
import queueReducer from './slices/queue';
import paymentReducer from './slices/payment';
import { persistReducer } from 'redux-persist';
import {
  asyncStoragePersistConfig,
  sensitiveStoragePersistConfig,
} from './persist/config';

const rootReducer = combineReducers({
  ui: UIReducer,
  payment: paymentReducer,
  auth: persistReducer(sensitiveStoragePersistConfig('auth'), authReducer),
  queue: persistReducer(asyncStoragePersistConfig('queue'), queueReducer),
  entities: persistReducer(
    asyncStoragePersistConfig('entities'),
    entitiesReducer,
  ),
  session: sessionReducer,
  userSetting: persistReducer(
    asyncStoragePersistConfig('userSetting'),
    userSettingReducer,
  ),
});

export default persistReducer(
  asyncStoragePersistConfig('root', ['session', 'ui', 'payment']),
  rootReducer,
);
