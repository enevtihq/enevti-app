import { combineReducers } from '@reduxjs/toolkit';
import eligibleEntitySliceReducer from './eligible';
import welcomeEntitySliceReducer from './welcome';

export default combineReducers({
  eligible: eligibleEntitySliceReducer,
  welcome: welcomeEntitySliceReducer,
});
