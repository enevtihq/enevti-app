import { combineReducers } from '@reduxjs/toolkit';
import commentSessionReducer from './comment';

export default combineReducers({
  comment: commentSessionReducer,
});
