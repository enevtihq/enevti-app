import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './myPersona';
import profileEntitySliceReducer from './myProfile';
import onceEntitySliceReducer from './once';

export default combineReducers({
  once: onceEntitySliceReducer,
  myProfile: profileEntitySliceReducer,
  myPersona: personaEntitySliceReducer,
});
