import { combineReducers } from '@reduxjs/toolkit';
import socialRaffleReducer from './socialRaffle';
import syncedReducer from './synced';

export default combineReducers({
  socialRaffle: socialRaffleReducer,
  synced: syncedReducer,
});
