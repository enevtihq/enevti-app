import { combineReducers } from '@reduxjs/toolkit';
import processingTransactionSessionReducer from './processing';
import processedThisBlockReducer from './processedThisBlock';

export default combineReducers({
  proccessing: processingTransactionSessionReducer,
  processedThisBlock: processedThisBlockReducer,
});
