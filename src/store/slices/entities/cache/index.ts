import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './myPersona';
import profileEntitySliceReducer from './myProfile';

export default combineReducers({
  myProfile: profileEntitySliceReducer,
  myPersona: personaEntitySliceReducer,
});
