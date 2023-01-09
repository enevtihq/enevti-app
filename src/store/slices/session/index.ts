import { combineReducers } from '@reduxjs/toolkit';
import localSessionReducer from './local';
import transactionSessionReducer from './transaction';
import engagementSessionReducer from './engagement';

export default combineReducers({
  local: localSessionReducer,
  transaction: transactionSessionReducer,
  engagement: engagementSessionReducer,
});
