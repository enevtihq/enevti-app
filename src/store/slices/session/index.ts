import { combineReducers } from '@reduxjs/toolkit';
import localSessionReducer from './local';
import googleSessionReducer from './google';

export default combineReducers({
  local: localSessionReducer,
  google: googleSessionReducer,
});
