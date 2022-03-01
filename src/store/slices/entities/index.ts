import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './persona';
import profileEntitySliceReducer from './profile';

export default combineReducers({
  profile: profileEntitySliceReducer,
  persona: personaEntitySliceReducer,
});
