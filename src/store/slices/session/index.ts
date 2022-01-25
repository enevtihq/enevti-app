import { combineReducers } from '@reduxjs/toolkit';
import localSessionReducer, { setLocalSessionKey } from './local';
import googleSessionReducer, { setGoogleAPIToken } from './google';

export { setLocalSessionKey, setGoogleAPIToken };

export default combineReducers({
  local: localSessionReducer,
  google: googleSessionReducer,
});
