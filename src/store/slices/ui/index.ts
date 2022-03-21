import { combineReducers } from '@reduxjs/toolkit';
import UIGlobalReducer from './global';
import screenReducer from './screen';

export default combineReducers({
  global: UIGlobalReducer,
  screen: screenReducer,
});
