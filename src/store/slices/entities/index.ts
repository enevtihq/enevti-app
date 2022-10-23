import { combineReducers } from '@reduxjs/toolkit';
import onceEntitySliceReducer from './once';
import cacheReducer from './cache';
import chainConfigReducer from './chainConfig';
import notificationReducer from './notification';
import onboardingReducer from './onboarding';
import appOpenCounter from './appOpenCounter';

export default combineReducers({
  once: onceEntitySliceReducer,
  cache: cacheReducer,
  chainConfig: chainConfigReducer,
  notification: notificationReducer,
  onboarding: onboardingReducer,
  appOpenCounter: appOpenCounter,
});
