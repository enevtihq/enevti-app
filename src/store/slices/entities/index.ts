import { combineReducers } from '@reduxjs/toolkit';
import onceEntitySliceReducer from './once';
import cacheReducer from './cache';

export default combineReducers({
  once: onceEntitySliceReducer,
  cache: cacheReducer,
});
