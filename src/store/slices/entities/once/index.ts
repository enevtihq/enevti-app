import { combineReducers } from '@reduxjs/toolkit';
import eligibleEntitySliceReducer from './eligible';
import welcomeEntitySliceReducer from './welcome';
import onceLikeEntitySliceReducer from './like';
import UserMetaEntitySliceReducer from './userMeta';

export default combineReducers({
  eligible: eligibleEntitySliceReducer,
  welcome: welcomeEntitySliceReducer,
  like: onceLikeEntitySliceReducer,
  userMeta: UserMetaEntitySliceReducer,
});
