import { combineReducers } from 'redux';
import authReducer from './slices/auth';
import userSettingReducer from './slices/userSetting';

export default combineReducers({
  auth: authReducer,
  userSetting: userSettingReducer,
});
