import { combineReducers } from '@reduxjs/toolkit';
import appOnboardingSliceReducer from './app';

export default combineReducers({
  app: appOnboardingSliceReducer,
});
