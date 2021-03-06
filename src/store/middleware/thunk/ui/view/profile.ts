import { getBasePersonaByRouteParam, getMyAddress, getMyBasePersona } from 'enevti-app/service/enevti/persona';
import {
  getMyProfile,
  getMyProfileInitialCollection,
  getMyProfileInitialOwned,
  getProfile,
  getProfileCollection,
  getProfileInitialCollection,
  getProfileInitialOwned,
  getProfileOwned,
} from 'enevti-app/service/enevti/profile';
import { handleError, isErrorResponse } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  pushMyProfileViewCollection,
  pushMyProfileViewOwnedNFT,
  resetMyProfileView,
  selectMyProfileView,
  selectMyProfileViewCollection,
  selectMyProfileViewOwned,
  setMyProfileView,
  setMyProfileViewCollectionPagination,
  setMyProfileViewLoaded,
  setMyProfileViewOwnedPagination,
  setMyProfileViewReqStatus,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  clearProfileByKey,
  initProfileView,
  pushProfileViewCollection,
  pushProfileViewOwnedNFT,
  selectProfileView,
  selectProfileViewCollection,
  selectProfileViewOwned,
  setProfileView,
  setProfileViewCollectionPagination,
  setProfileViewLoaded,
  setProfileViewOwnedPagination,
  setProfileViewReqStatus,
  setProfileViewVersion,
} from 'enevti-app/store/slices/ui/view/profile';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Persona } from 'enevti-app/types/core/account/persona';
import { Profile } from 'enevti-app/types/core/account/profile';
import { payManualDeliverSecret } from 'enevti-app/store/middleware/thunk/payment/creator/payDeliverSecret';
import { PROFILE_COLLECTION_RESPONSE_LIMIT, PROFILE_OWNED_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';
import i18n from 'enevti-app/translations/i18n';

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
        dispatch(initProfileView(route.key));
        const personaBase = await getBasePersonaByRouteParam(route.params, signal);
        if (personaBase.status === 200 && !isErrorResponse(personaBase)) {
          const profileResponse = await getProfile(personaBase.data.address, signal);
          const ownedResponse = await getProfileInitialOwned(personaBase.data.address, signal);
          const collectionResponse = await getProfileInitialCollection(personaBase.data.address, signal);
          if (profileResponse.status === 200 && !isErrorResponse(profileResponse)) {
            dispatch(
              setProfileView({
                key: route.key,
                value: {
                  ...profileResponse.data,
                  persona: personaBase.data,
                  version: Date.now(),
                  owned: ownedResponse.data.data,
                  collection: collectionResponse.data.data,
                },
              }),
            );
            dispatch(
              setProfileViewOwnedPagination({
                key: route.key,
                value: {
                  checkpoint: ownedResponse.data.checkpoint,
                  version: ownedResponse.data.version,
                },
              }),
            );
            dispatch(
              setProfileViewCollectionPagination({
                key: route.key,
                value: {
                  checkpoint: collectionResponse.data.checkpoint,
                  version: collectionResponse.data.version,
                },
              }),
            );
          }
        }
        dispatch(setProfileViewReqStatus({ key: route.key, value: personaBase.status }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      if (isMyProfile) {
        dispatch(setMyProfileViewLoaded(true));
      } else {
        dispatch(setProfileViewLoaded({ key: route.key, value: true }));
      }
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
        const offset = selectMyProfileView(getState()).ownedPagination.checkpoint;
        const version = selectMyProfileView(getState()).ownedPagination.version;
        if (myProfileOwned.length !== version) {
          const myAddress = await getMyAddress();
          const ownedResponse = await getProfileOwned(myAddress, offset, PROFILE_OWNED_RESPONSE_LIMIT, version, signal);
          dispatch(
            setMyProfileView({
              ...selectMyProfileView(getState()),
              version: Date.now(),
            }),
          );
          dispatch(pushMyProfileViewOwnedNFT(ownedResponse.data.data));
          dispatch(
            setMyProfileViewOwnedPagination({
              checkpoint: ownedResponse.data.checkpoint,
              version: ownedResponse.data.version,
            }),
          );
        }
      } else {
        const profile = selectProfileView(getState(), route.key);
        const profileOwned = selectProfileViewOwned(getState(), route.key);
        const offset = profile.ownedPagination.checkpoint;
        const version = profile.ownedPagination.version;
        if (profileOwned.length !== version) {
          const personaBase = await getBasePersonaByRouteParam(route.params, signal);
          if (personaBase.status === 200 && !isErrorResponse(personaBase)) {
            const ownedResponse = await getProfileOwned(
              personaBase.data.address,
              offset,
              PROFILE_OWNED_RESPONSE_LIMIT,
              version,
              signal,
            );
            dispatch(setProfileViewVersion({ key: route.key, value: Date.now() }));
            dispatch(pushProfileViewOwnedNFT({ key: route.key, value: ownedResponse.data.data }));
            dispatch(
              setProfileViewOwnedPagination({
                key: route.key,
                value: {
                  checkpoint: ownedResponse.data.checkpoint,
                  version: ownedResponse.data.version,
                },
              }),
            );
          }
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
        const offset = selectMyProfileView(getState()).collectionPagination.checkpoint;
        const version = selectMyProfileView(getState()).collectionPagination.version;
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
              ...selectMyProfileView(getState()),
              version: Date.now(),
            }),
          );
          dispatch(pushMyProfileViewCollection(collectionResponse.data.data));
          dispatch(
            setMyProfileViewCollectionPagination({
              checkpoint: collectionResponse.data.checkpoint,
              version: collectionResponse.data.version,
            }),
          );
        }
      } else {
        const profile = selectProfileView(getState(), route.key);
        const profileCollection = selectProfileViewCollection(getState(), route.key);
        const offset = profile.collectionPagination.checkpoint;
        const version = profile.collectionPagination.version;
        if (profileCollection.length !== version) {
          const personaBase = await getBasePersonaByRouteParam(route.params, signal);
          if (personaBase.status === 200 && !isErrorResponse(personaBase)) {
            const collectionResponse = await getProfileCollection(
              personaBase.data.address,
              offset,
              PROFILE_COLLECTION_RESPONSE_LIMIT,
              version,
              signal,
            );
            dispatch(setProfileViewVersion({ key: route.key, value: Date.now() }));
            dispatch(pushProfileViewCollection({ key: route.key, value: collectionResponse.data.data }));
            dispatch(
              setProfileViewCollectionPagination({
                key: route.key,
                value: {
                  checkpoint: collectionResponse.data.checkpoint,
                  version: collectionResponse.data.version,
                },
              }),
            );
          }
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
  const personaResponse = await getMyBasePersona(reload, signal);
  if (personaResponse.status !== 200) {
    throw Error(i18n.t('profile:errorLoadingMyProfile'));
  }
  const profileResponse = await getMyProfile(reload, signal);
  const ownedResponse = await getMyProfileInitialOwned(reload, signal);
  const collectionResponse = await getMyProfileInitialCollection(reload, signal);
  dispatch(
    setMyProfileView({
      ...(profileResponse.data as Profile),
      persona: personaResponse.data as Persona,
      owned: ownedResponse.data.data,
      collection: collectionResponse.data.data,
      version: Date.now(),
    }),
  );
  dispatch(
    setMyProfileViewOwnedPagination({
      checkpoint: ownedResponse.data.checkpoint,
      version: ownedResponse.data.version,
    }),
  );
  dispatch(
    setMyProfileViewCollectionPagination({
      checkpoint: collectionResponse.data.checkpoint,
      version: collectionResponse.data.version,
    }),
  );
  dispatch(setMyProfileViewReqStatus(profileResponse.status));
};
