import { combineReducers } from '@reduxjs/toolkit';
import personaEntitySliceReducer from './myPersona';
import profileEntitySliceReducer from './myProfile';
import myPublicKeyEntitySliceReducer from './myPublicKey';
import feedCacheSliceReducer from './feed';
import momentCacheSliceReducer from './moment';
import transactionNonceCacheSliceReducer from './transactionNonce';
import fcmTokenCacheSliceReducer from './fcm';
import apnTokenCacheSliceReducer from './apn';
import cacheVersionSliceReducer from './version';

export default combineReducers({
  myProfile: profileEntitySliceReducer,
  myPersona: personaEntitySliceReducer,
  myPublicKey: myPublicKeyEntitySliceReducer,
  feed: feedCacheSliceReducer,
  moment: momentCacheSliceReducer,
  transactionNonce: transactionNonceCacheSliceReducer,
  fcm: fcmTokenCacheSliceReducer,
  apn: apnTokenCacheSliceReducer,
  version: cacheVersionSliceReducer,
});
