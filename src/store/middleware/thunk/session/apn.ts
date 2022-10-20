import { AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { selectAPNTokenCacheState, setAPNTokenCache } from 'enevti-app/store/slices/entities/cache/apn';
import { getMyAddress, getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { getAPNIsTokenUpdated, postAPNRegisterAddress } from 'enevti-app/service/enevti/apn';
import { Platform } from 'react-native';

type InitAPNTokenPayload = { token?: string };
type UpdateAPNTokenPayload = { publicKey: string };
type SetAPNTokenPayload = { publicKey: string; token: string };

// init apn for first app launch
export const initAPNToken = createAsyncThunk<void, InitAPNTokenPayload, AsyncThunkAPI>(
  'apn/initAPNToken',
  async (payload, { dispatch, getState, signal }) => {
    try {
      if (Platform.OS === 'ios') {
        const tokenCache = selectAPNTokenCacheState(getState());
        const apnToken = payload.token ?? tokenCache;
        if (payload.token !== tokenCache && apnToken) {
          dispatch(setAPNTokenCache(apnToken));
        }
        const myAddress = await getMyAddress();
        const APNIsTokenUpdated = await getAPNIsTokenUpdated(myAddress, apnToken, signal);
        if (APNIsTokenUpdated.status === 200 && !APNIsTokenUpdated.data && myAddress && apnToken) {
          const publicKey = await getMyPublicKey();
          dispatch(setAPNToken({ publicKey, token: apnToken }) as unknown as AnyAction);
        }
      }
    } catch (err) {
      handleError(err, undefined, true);
    }
  },
);

// update apn after address is generated
export const updateAPNToken = createAsyncThunk<void, UpdateAPNTokenPayload, AsyncThunkAPI>(
  'apn/updateAPNToken',
  async (payload, { dispatch, getState }) => {
    try {
      if (Platform.OS === 'ios') {
        const token = selectAPNTokenCacheState(getState());
        dispatch(setAPNToken({ publicKey: payload.publicKey, token }) as unknown as AnyAction);
      }
    } catch (err) {
      handleError(err);
    }
  },
);

// helper
export const setAPNToken = createAsyncThunk<void, SetAPNTokenPayload, AsyncThunkAPI>(
  'apn/setAPNToken',
  async (payload, { dispatch, getState, signal }) => {
    try {
      if (Platform.OS === 'ios') {
        await postAPNRegisterAddress(payload.token, payload.publicKey, signal);
        const tokenCache = selectAPNTokenCacheState(getState());
        if (payload.token !== tokenCache) {
          dispatch(setAPNTokenCache(payload.token));
        }
      }
    } catch (err) {
      handleError(err);
    }
  },
);
