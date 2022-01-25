import { combineReducers } from '@reduxjs/toolkit';
import UIGlobalReducer from './global';

export default combineReducers({
  global: UIGlobalReducer,
});
