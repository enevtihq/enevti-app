import { combineReducers } from '@reduxjs/toolkit';
import profileViewReducer from './profile';
import myProfileViewReducer from './myProfile';
import collectionViewReducer from './collection';
import nftDetailsViewReducer from './nftDetails';
import stakePoolReducer from './stakePool';
import feedViewReducer from './feed';
import recentMomentViewReducer from './recentMoment';
import walletViewReducer from './wallet';
import commentViewReducer from './comment';
import momentViewReducer from './moment';

export default combineReducers({
  profile: profileViewReducer,
  myProfile: myProfileViewReducer,
  collection: collectionViewReducer,
  nftDetails: nftDetailsViewReducer,
  stakePool: stakePoolReducer,
  feed: feedViewReducer,
  recentMoment: recentMomentViewReducer,
  wallet: walletViewReducer,
  comment: commentViewReducer,
  moment: momentViewReducer,
});
