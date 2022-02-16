import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer, { setPersona } from './persona';

export { setPersona };

export default combineReducers({
  persona: personaEntitySliceReducer,
});
