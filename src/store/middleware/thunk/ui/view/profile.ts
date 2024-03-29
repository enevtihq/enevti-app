import { getBasePersonaByRouteParam, getMyAddress } from 'enevti-app/service/enevti/persona';
import {
  getMyProfile,
  getProfile,
  getProfileCollection,
  getProfileMoment,
  getProfileOwned,
} from 'enevti-app/service/enevti/profile';
import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  myProfileInitialState,
  resetMyProfileView,
  selectMyProfileView,
  selectMyProfileViewCollection,
  selectMyProfileViewMomentCreated,
  selectMyProfileViewOwned,
  setMyProfileView,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  clearProfileByKey,
  profileInitialStateItem,
  selectProfileView,
  selectProfileViewCollection,
  selectProfileViewMomentCreated,
  selectProfileViewOwned,
  setProfileView,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { payManualDeliverSecret } from 'enevti-app/store/middleware/thunk/payment/creator/payDeliverSecret';
import {
  PROFILE_COLLECTION_INITIAL_LENGTH,
  PROFILE_COLLECTION_RESPONSE_LIMIT,
  PROFILE_MOMENT_INITIAL_LENGTH,
  PROFILE_MOMENT_RESPONSE_LIMIT,
  PROFILE_OWNED_INITIAL_LENGTH,
  PROFILE_OWNED_RESPONSE_LIMIT,
} from 'enevti-app/utils/constant/limit';
import { Platform } from 'react-native';
import { IOS_MIN_RELOAD_TIME } from 'enevti-app/utils/constant/reload';
import sleep from 'enevti-app/utils/dummy/sleep';

type ProfileRoute = StackScreenProps<RootStackParamList, 'Profile'>['route'];
type LoadProfileArgs = { route: ProfileRoute; reload: boolean; isMyProfile: boolean };

export const loadProfile = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadProfile',
  async ({ route, reload, isMyProfile }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      if (isMyProfile) {
        await loadMyProfile(reload, dispatch, signal);
      } else {
        await loadProfileBase(reload, route, dispatch, signal);
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreOwned = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadMoreOwned',
  async ({ route, isMyProfile }, { dispatch, getState, signal }) => {
    try {
      if (isMyProfile) {
        const myProfileOwned = selectMyProfileViewOwned(getState());
        const myProfileView = selectMyProfileView(getState());
        const offset = myProfileView.ownedPagination.checkpoint;
        const version = myProfileView.ownedPagination.version;
        if (myProfileOwned.length !== version) {
          const myAddress = await getMyAddress();
          const ownedResponse = await getProfileOwned(myAddress, offset, PROFILE_OWNED_RESPONSE_LIMIT, version, signal);
          dispatch(
            setMyProfileView({
              ...myProfileView,
              version: Date.now(),
              ownedPagination: {
                checkpoint: ownedResponse.data.checkpoint,
                version: ownedResponse.data.version,
              },
              owned: myProfileView.owned.concat(ownedResponse.data.data),
            }),
          );
        }
      } else {
        const profile = selectProfileView(getState(), route.key);
        const profileOwned = selectProfileViewOwned(getState(), route.key);
        const offset = profile.ownedPagination.checkpoint;
        const version = profile.ownedPagination.version;
        if (profileOwned.length !== version) {
          const ownedResponse = await getProfileOwned(
            profile.persona.address,
            offset,
            PROFILE_OWNED_RESPONSE_LIMIT,
            version,
            signal,
          );
          dispatch(
            setProfileView({
              key: route.key,
              value: {
                ...profile,
                version: Date.now(),
                owned: profile.owned.concat(ownedResponse.data.data),
                ownedPagination: {
                  checkpoint: ownedResponse.data.checkpoint,
                  version: ownedResponse.data.version,
                },
              },
            }),
          );
        }
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const loadMoreCollection = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadMoreCollection',
  async ({ route, isMyProfile }, { dispatch, getState, signal }) => {
    try {
      if (isMyProfile) {
        const myProfileCollection = selectMyProfileViewCollection(getState());
        const myProfileView = selectMyProfileView(getState());
        const offset = myProfileView.collectionPagination.checkpoint;
        const version = myProfileView.collectionPagination.version;
        if (myProfileCollection.length !== version) {
          const myAddress = await getMyAddress();
          const collectionResponse = await getProfileCollection(
            myAddress,
            offset,
            PROFILE_COLLECTION_RESPONSE_LIMIT,
            version,
            signal,
          );
          dispatch(
            setMyProfileView({
              ...myProfileView,
              version: Date.now(),
              collection: myProfileView.collection.concat(collectionResponse.data.data),
              collectionPagination: {
                checkpoint: collectionResponse.data.checkpoint,
                version: collectionResponse.data.version,
              },
            }),
          );
        }
      } else {
        const profile = selectProfileView(getState(), route.key);
        const profileCollection = selectProfileViewCollection(getState(), route.key);
        const offset = profile.collectionPagination.checkpoint;
        const version = profile.collectionPagination.version;
        if (profileCollection.length !== version) {
          const collectionResponse = await getProfileCollection(
            profile.persona.address,
            offset,
            PROFILE_COLLECTION_RESPONSE_LIMIT,
            version,
            signal,
          );
          dispatch(
            setProfileView({
              key: route.key,
              value: {
                ...profile,
                version: Date.now(),
                collection: profile.collection.concat(collectionResponse.data.data),
                collectionPagination: {
                  checkpoint: collectionResponse.data.checkpoint,
                  version: collectionResponse.data.version,
                },
              },
            }),
          );
        }
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const loadMoreMoment = createAsyncThunk<void, LoadProfileArgs, AsyncThunkAPI>(
  'profileView/loadMoreMoment',
  async ({ route, isMyProfile }, { dispatch, getState, signal }) => {
    try {
      if (isMyProfile) {
        const myProfileMoment = selectMyProfileViewMomentCreated(getState());
        const myProfileView = selectMyProfileView(getState());
        const offset = myProfileView.momentPagination.checkpoint;
        const version = myProfileView.momentPagination.version;
        if (myProfileMoment.length !== version) {
          const myAddress = await getMyAddress();
          const momentResponse = await getProfileMoment(
            myAddress,
            offset,
            PROFILE_MOMENT_RESPONSE_LIMIT,
            version,
            signal,
          );
          dispatch(
            setMyProfileView({
              ...myProfileView,
              version: Date.now(),
              momentCreated: myProfileView.momentCreated.concat(momentResponse.data.data),
              momentPagination: {
                checkpoint: momentResponse.data.checkpoint,
                version: momentResponse.data.version,
              },
            }),
          );
        }
      } else {
        const profile = selectProfileView(getState(), route.key);
        const profileMoment = selectProfileViewMomentCreated(getState(), route.key);
        const offset = profile.momentPagination.checkpoint;
        const version = profile.momentPagination.version;
        if (profileMoment.length !== version) {
          const momentResponse = await getProfileMoment(
            profile.persona.address,
            offset,
            PROFILE_MOMENT_RESPONSE_LIMIT,
            version,
            signal,
          );
          dispatch(
            setProfileView({
              key: route.key,
              value: {
                ...profile,
                version: Date.now(),
                momentCreated: profile.momentCreated.concat(momentResponse.data.data),
                momentPagination: {
                  checkpoint: momentResponse.data.checkpoint,
                  version: momentResponse.data.version,
                },
              },
            }),
          );
        }
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const initProfile = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'home/initProfile',
  async (_, { dispatch, getState, signal }) => {
    try {
      await loadMyProfile(true, dispatch, signal);
      const myProfile = selectMyProfileView(getState());
      if (myProfile.pending > 0) {
        dispatch(payManualDeliverSecret() as unknown as AnyAction);
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadProfile =
  (route: ProfileRoute, isMyProfile: boolean): AppThunk =>
  dispatch => {
    if (isMyProfile) {
      dispatch(resetMyProfileView());
    } else {
      dispatch(clearProfileByKey(route.key));
    }
  };

export const loadMyProfile = async (reload: boolean, dispatch: any, signal?: AbortController['signal']) => {
  let reloadTime = 0;
  reload && Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
  const initialProfileState = !reload ? myProfileInitialState : {};
  const profileResponse = await getMyProfile(reload, true, true, signal);
  if (reload && Platform.OS === 'ios') {
    reloadTime = Date.now() - reloadTime;
    await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
  }
  dispatch(
    setMyProfileView({
      ...initialProfileState,
      ...profileResponse.data,
      render: {
        owned: true,
        onsale: true,
        collection: false,
        momentCreated: false,
      },
      version: Date.now(),
      ownedPagination: {
        checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
        version: profileResponse.version.owned,
      },
      collectionPagination: {
        checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
        version: profileResponse.version.collection,
      },
      momentPagination: {
        checkpoint: PROFILE_MOMENT_INITIAL_LENGTH,
        version: profileResponse.version.momentCreated,
      },
      reqStatus: profileResponse.status,
      loaded: true,
    }),
  );
};

export const loadProfileBase = async (
  reload: boolean,
  route: ProfileRoute,
  dispatch: any,
  signal?: AbortController['signal'],
) => {
  let reloadTime = 0;
  const initialProfileState = !reload ? profileInitialStateItem : {};
  reload && Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
  const personaBase = await getBasePersonaByRouteParam(route.params, signal);
  if (personaBase.status === 200 && !isErrorResponse(personaBase)) {
    const profileResponse = await getProfile(personaBase.data.address, false, true, signal);
    if (reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
    dispatch(
      setProfileView({
        key: route.key,
        value: {
          ...initialProfileState,
          ...profileResponse.data,
          render: {
            owned: true,
            onsale: true,
            collection: false,
            momentCreated: false,
          },
          persona: personaBase.data,
          version: Date.now(),
          ownedPagination: {
            checkpoint: PROFILE_OWNED_INITIAL_LENGTH,
            version: profileResponse.version.owned,
          },
          collectionPagination: {
            checkpoint: PROFILE_COLLECTION_INITIAL_LENGTH,
            version: profileResponse.version.collection,
          },
          momentPagination: {
            checkpoint: PROFILE_MOMENT_INITIAL_LENGTH,
            version: profileResponse.version.momentCreated,
          },
          loaded: true,
          reqStatus: personaBase.status,
        },
      }),
    );
  } else {
    dispatch(
      setProfileView({
        key: route.key,
        value: { ...initialProfileState, loaded: true, reqStatus: personaBase.status },
      }),
    );
  }
};
