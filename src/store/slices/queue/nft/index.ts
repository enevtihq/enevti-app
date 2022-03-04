import { combineReducers } from '@reduxjs/toolkit';
import createNFTQueueSliceReducer from './create';

export default combineReducers({
  create: createNFTQueueSliceReducer,
});
