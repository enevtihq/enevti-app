import { combineReducers } from '@reduxjs/toolkit';
import onceEntitySliceReducer from './once';
import cacheReducer from './cache';
import appOpenCounter from './appOpenCounter';

export default combineReducers({
  once: onceEntitySliceReducer,
  cache: cacheReducer,
  appOpenCounter: appOpenCounter,
});
