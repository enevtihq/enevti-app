import { AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import messaging from '@react-native-firebase/messaging';
import { selectFCMTokenCacheState, setFCMTokenCache } from 'enevti-app/store/slices/entities/cache/fcm';
import { getMyAddress, getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { getFCMIsTokenUpdated, postFCMRegisterAddress } from 'enevti-app/service/enevti/fcm';
import notifee from '@notifee/react-native';

type InitFCMTokenPayload = undefined;
type RefreshFCMTokenPayload = { token: string };
type UpdateFCMTokenPayload = { publicKey: string };
type SetFCMTokenPayload = { publicKey: string; token: string };

// init fcm for first app launch
export const initFCMToken = createAsyncThunk<void, InitFCMTokenPayload, AsyncThunkAPI>(
  'fcm/initFCMToken',
  async (_, { dispatch, getState, signal }) => {
    try {
      await notifee.requestPermission();
      let authStatus = await messaging().hasPermission();
      if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
        authStatus = await messaging().requestPermission();
      }
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          const tokenCache = selectFCMTokenCacheState(getState());
          if (fcmToken !== tokenCache) {
            dispatch(setFCMTokenCache(fcmToken));
          }
          const myAddress = await getMyAddress();
          const FCMIsTokenUpdated = await getFCMIsTokenUpdated(myAddress, fcmToken, signal);
          if (FCMIsTokenUpdated.status === 200 && !FCMIsTokenUpdated.data && myAddress) {
            const publicKey = await getMyPublicKey();
            dispatch(setFCMToken({ publicKey, token: fcmToken }) as unknown as AnyAction);
          }
        }
      }
    } catch (err) {
      handleError(err, undefined, true);
    }
  },
);

// onTokenRefresh
export const refreshFCMToken = createAsyncThunk<void, RefreshFCMTokenPayload, AsyncThunkAPI>(
  'fcm/refreshFCMToken',
  async (payload, { dispatch }) => {
    try {
      const publicKey = await getMyPublicKey();
      dispatch(setFCMToken({ publicKey, token: payload.token }) as unknown as AnyAction);
    } catch (err) {
      handleError(err);
    }
  },
);

// update fcm after address is generated
export const updateFCMToken = createAsyncThunk<void, UpdateFCMTokenPayload, AsyncThunkAPI>(
  'fcm/updateFCMToken',
  async (payload, { dispatch }) => {
    try {
      const token = await messaging().getToken();
      dispatch(setFCMToken({ publicKey: payload.publicKey, token }) as unknown as AnyAction);
    } catch (err) {
      handleError(err);
    }
  },
);

// helper
export const setFCMToken = createAsyncThunk<void, SetFCMTokenPayload, AsyncThunkAPI>(
  'fcm/setFCMToken',
  async (payload, { dispatch, getState, signal }) => {
    try {
      await postFCMRegisterAddress(payload.token, payload.publicKey, signal);
      const tokenCache = selectFCMTokenCacheState(getState());
      if (payload.token !== tokenCache) {
        dispatch(setFCMTokenCache(payload.token));
      }
    } catch (err) {
      handleError(err);
    }
  },
);
