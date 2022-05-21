import { combineReducers } from '@reduxjs/toolkit';
import processingTransactionSessionReducer from './processing';

export default combineReducers({
  proccessing: processingTransactionSessionReducer,
});
