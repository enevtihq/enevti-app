import { combineReducers } from '@reduxjs/toolkit';
import lockedReducer from './locked';
import lastActiveReducer from './lastActive';
import displayReducer from './display';

export default combineReducers({
  locked: lockedReducer,
  lastActive: lastActiveReducer,
  display: displayReducer,
});
