import { combineReducers } from '@reduxjs/toolkit';
import profileViewReducer from './profile';
import myProfileViewReducer from './myProfile';

export default combineReducers({
  profile: profileViewReducer,
  myProfile: myProfileViewReducer,
});
