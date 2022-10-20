import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './myPersona';
import profileEntitySliceReducer from './myProfile';
import feedCacheSliceReducer from './feed';
import momentCacheSliceReducer from './moment';
import transactionNonceCacheSliceReducer from './transactionNonce';
import fcmTokenCacheSliceReducer from './fcm';
import apnTokenCacheSliceReducer from './apn';

export default combineReducers({
  myProfile: profileEntitySliceReducer,
  myPersona: personaEntitySliceReducer,
  feed: feedCacheSliceReducer,
  moment: momentCacheSliceReducer,
  transactionNonce: transactionNonceCacheSliceReducer,
  fcm: fcmTokenCacheSliceReducer,
  apn: apnTokenCacheSliceReducer,
});
