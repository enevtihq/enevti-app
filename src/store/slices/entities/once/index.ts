import { combineReducers } from '@reduxjs/toolkit';
import eligibleEntitySliceReducer from './eligible';

export default combineReducers({
  eligible: eligibleEntitySliceReducer,
});
