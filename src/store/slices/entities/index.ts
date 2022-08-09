import { combineReducers } from '@reduxjs/toolkit';
import onceEntitySliceReducer from './once';
import cacheReducer from './cache';
import chainConfigReducer from './chainConfig';
import appOpenCounter from './appOpenCounter';

export default combineReducers({
  once: onceEntitySliceReducer,
  cache: cacheReducer,
  chainConfig: chainConfigReducer,
  appOpenCounter: appOpenCounter,
});
