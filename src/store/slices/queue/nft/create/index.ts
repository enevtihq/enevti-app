import { combineReducers } from '@reduxjs/toolkit';
import createNFTTypeQueueSliceReducer from './type';
import createNFTRouteQueueSliceReducer from './route';
import createNFTOneKindQueueSliceReducer from './onekind';
import createNFTPackQueueSliceReducer from './pack';

export default combineReducers({
  type: createNFTTypeQueueSliceReducer,
  route: createNFTRouteQueueSliceReducer,
  onekind: createNFTOneKindQueueSliceReducer,
  pack: createNFTPackQueueSliceReducer,
});
