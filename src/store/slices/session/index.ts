import { combineReducers } from '@reduxjs/toolkit';
import localSessionReducer from './local';
import googleSessionReducer from './google';
import transactionSessionReducer from './transaction';
import engagementSessionReducer from './engagement';

export default combineReducers({
  local: localSessionReducer,
  google: googleSessionReducer,
  transaction: transactionSessionReducer,
  engagement: engagementSessionReducer,
});
