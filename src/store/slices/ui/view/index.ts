import { combineReducers } from '@reduxjs/toolkit';
import profileViewReducer from './profile';
import myProfileViewReducer from './myProfile';
import collectionViewReducer from './collection';
import nftDetailsViewReducer from './nftDetails';
import stakePoolReducer from './stakePool';
import feedViewReducer from './feed';
import momentViewReducer from './moment';
import walletViewReducer from './wallet';

export default combineReducers({
  profile: profileViewReducer,
  myProfile: myProfileViewReducer,
  collection: collectionViewReducer,
  nftDetails: nftDetailsViewReducer,
  stakePool: stakePoolReducer,
  feed: feedViewReducer,
  moment: momentViewReducer,
  wallet: walletViewReducer,
});
