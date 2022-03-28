import { combineReducers } from '@reduxjs/toolkit';
import profileViewReducer from './profile';
import myProfileViewReducer from './myProfile';
import collectionViewReducer from './collection';

export default combineReducers({
  profile: profileViewReducer,
  myProfile: myProfileViewReducer,
  collection: collectionViewReducer,
});
