import { AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import messaging from '@react-native-firebase/messaging';
import {
  isFCMTokenCacheReady,
  selectFCMTokenCacheState,
  setFCMTokenCache,
} from 'enevti-app/store/slices/entities/cache/fcm';
import { getMyAddress, getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { getFCMIsAddressRegistered, postFCMRegisterAddress } from 'enevti-app/service/enevti/fcm';

type InitFCMTokenPayload = undefined;
type RefreshFCMTokenPayload = { token: string };
type UpdateFCMTokenPayload = { publicKey: string };
type SetFCMTokenPayload = { publicKey: string; token: string };

// init fcm for first app launch
export const initFCMToken = createAsyncThunk<void, InitFCMTokenPayload, AsyncThunkAPI>(
  'fcm/initFCMToken',
  async (_, { dispatch, getState, signal }) => {
    try {
      const isFCMReady = isFCMTokenCacheReady(getState());
      if (!isFCMReady) {
        const fcmToken = await messaging().getToken();
        dispatch(setFCMTokenCache(fcmToken));
      }
      const myAddress = await getMyAddress();
      const FCMRegistered = await getFCMIsAddressRegistered(myAddress, signal);
      if (FCMRegistered.status === 200 && !FCMRegistered.data && myAddress) {
        const fcmTokenCache = selectFCMTokenCacheState(getState());
        const token = fcmTokenCache ?? (await messaging().getToken());
        const publicKey = await getMyPublicKey();
        dispatch(setFCMToken({ publicKey, token }) as unknown as AnyAction);
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
  async (payload, { dispatch, getState }) => {
    try {
      const fcmTokenCache = selectFCMTokenCacheState(getState());
      const token = fcmTokenCache ?? (await messaging().getToken());
      dispatch(setFCMToken({ publicKey: payload.publicKey, token }) as unknown as AnyAction);
    } catch (err) {
      handleError(err);
    }
  },
);

// helper
export const setFCMToken = createAsyncThunk<void, SetFCMTokenPayload, AsyncThunkAPI>(
  'fcm/setFCMToken',
  async (payload, { dispatch, signal }) => {
    try {
      await postFCMRegisterAddress(payload.token, payload.publicKey, signal);
      dispatch(setFCMTokenCache(payload.token));
    } catch (err) {
      handleError(err);
    }
  },
);
