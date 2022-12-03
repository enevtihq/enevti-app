import { combineReducers } from '@reduxjs/toolkit';
import nftQueueSliceReducer from './nft';
import momentQueueSliceReducer from './moment';

export default combineReducers({
  nft: nftQueueSliceReducer,
  moment: momentQueueSliceReducer,
});
