import { combineReducers } from '@reduxjs/toolkit';
import nftQueueSliceReducer from './nft';

export default combineReducers({
  nft: nftQueueSliceReducer,
});
