import { combineReducers } from '@reduxjs/toolkit';
import UIGlobalReducer from './global';
import screenReducer from './screen';
import viewReducer from './view';

export default combineReducers({
  global: UIGlobalReducer,
  screen: screenReducer,
  view: viewReducer,
});
