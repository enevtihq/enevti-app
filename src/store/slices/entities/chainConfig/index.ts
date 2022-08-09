import { combineReducers } from '@reduxjs/toolkit';
import socialRaffleReducer from './socialRaffle';

export default combineReducers({
  socialRaffle: socialRaffleReducer,
});
