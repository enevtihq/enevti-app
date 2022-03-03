import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './persona';
import profileEntitySliceReducer from './profile';
import onceEntitySliceReducer from './once';

export default combineReducers({
  once: onceEntitySliceReducer,
  profile: profileEntitySliceReducer,
  persona: personaEntitySliceReducer,
});
