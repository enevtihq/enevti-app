import { combineReducers } from '@reduxjs/toolkit';
import createMomentQueueSliceReducer from './create';

export default combineReducers({
  create: createMomentQueueSliceReducer,
});
