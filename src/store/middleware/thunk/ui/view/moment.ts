import { StackScreenProps } from '@react-navigation/stack';
import { AnyAction, createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { RootStackParamList } from 'enevti-app/navigation';
import { getCollectionMoment } from 'enevti-app/service/enevti/collection';
import { getMomentById } from 'enevti-app/service/enevti/moment';
import { getNFTMoment } from 'enevti-app/service/enevti/nft';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import { getProfileMoment } from 'enevti-app/service/enevti/profile';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import {
  addCollectionViewMomentLike,
  pushCollectionViewMoment,
  selectCollectionView,
} from 'enevti-app/store/slices/ui/view/collection';
import {
  clearMomentByKey,
  momentInitialStateItem,
  MomentsData,
  pushMomentView,
  selectMomentView,
  setMoment,
  setMomentView,
  setMomentViewLoaded,
} from 'enevti-app/store/slices/ui/view/moment';
import {
  addMyProfileViewMomentLike,
  selectMyProfileView,
  selectMyProfileViewMomentCreated,
  setMyProfileView,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  addNFTDetailsViewMomentLike,
  pushNFTDetailsViewMoment,
  selectNFTDetailsView,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import {
  addProfileViewMomentLike,
  selectProfileView,
  selectProfileViewMomentCreated,
  setProfileView,
} from 'enevti-app/store/slices/ui/view/profile';
import { addRecentMomentLike, selectRecentMomentState } from 'enevti-app/store/slices/ui/view/recentMoment';
import { AppThunk, AsyncThunkAPI, RootState } from 'enevti-app/store/state';
import {
  COLLECTION_MOMENT_RESPONSE_LIMIT,
  NFT_MOMENT_RESPONSE_LIMIT,
  PROFILE_MOMENT_RESPONSE_LIMIT,
} from 'enevti-app/utils/constant/limit';
import { IOS_MIN_RELOAD_TIME } from 'enevti-app/utils/constant/reload';
import sleep from 'enevti-app/utils/dummy/sleep';
import { handleError } from 'enevti-app/utils/error/handle';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { loadFeedsMoment } from './feed';
import { loadProfile } from './profile';
import { loadNFTDetails } from './nftDetails';
import { loadCollection } from './collection';

type MomentRoute = StackScreenProps<RootStackParamList, 'Moment'>['route'];
type LoadMomentArgs = { route: MomentRoute; reload?: boolean };

export const loadMoment = createAsyncThunk<void, LoadMomentArgs, AsyncThunkAPI>(
  'momentView/loadMoment',
  async (payload, { dispatch, getState, signal }) => {
    try {
      payload.reload && dispatch(showModalLoader());
      if (payload.route.params.mode === undefined) {
        await loadMomentFromId(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'feed') {
        await loadMomentFromFeed(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'profile') {
        await loadMomentFromProfile(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'myProfile') {
        await loadMomentFromMyProfile(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'nft') {
        await loadMomentFromNFT(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'collection') {
        await loadMomentFromCollection(payload, dispatch, getState, signal);
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      payload.reload && dispatch(hideModalLoader());
      EventRegister.emit(payload.route.key);
    }
  },
);

export const loadMoreMoment = createAsyncThunk<void, LoadMomentArgs, AsyncThunkAPI>(
  'momentView/loadMoreMoment',
  async (payload, { dispatch, getState, signal }) => {
    try {
      if (payload.route.params.mode === undefined) {
        await loadMoreMomentFromId(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'feed') {
        await loadMoreMomentFromFeed(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'profile') {
        await loadMoreMomentFromProfile(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'myProfile') {
        await loadMoreMomentFromMyProfile(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'nft') {
        await loadMoreMomentFromNFT(payload, dispatch, getState, signal);
      }
      if (payload.route.params.mode === 'collection') {
        await loadMoreMomentFromCollection(payload, dispatch, getState, signal);
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const setMomentById =
  ({ route, id, moment }: { route: MomentRoute; id: string; moment: Partial<MomentsData> }): AppThunk =>
  (dispatch, getState) => {
    const momentState = selectMomentView(getState(), route.key);
    const index = momentState.moments.findIndex(c => c.id === id);
    if (index !== -1) {
      dispatch(setMoment({ key: route.key, momentIndex: index, value: moment }));
    }
  };

export const addMomentLikeById =
  ({ route, id }: { route: MomentRoute; id: string }): AppThunk =>
  (dispatch, getState) => {
    const momentState = selectMomentView(getState(), route.key);
    const index = momentState.moments.findIndex(c => c.id === id);
    if (index !== -1) {
      dispatch(setMoment({ key: route.key, momentIndex: index, value: { like: momentState.moments[index].like + 1 } }));
    }

    if (route.params.mode === 'feed') {
      const state = selectRecentMomentState(getState());
      const stateIndex = state.items.findIndex(c => c.id === id);
      if (stateIndex !== -1) {
        dispatch(addRecentMomentLike({ index: stateIndex }));
      }
    }
    if (route.params.mode === 'profile') {
      const state = selectProfileView(getState(), route.params.arg!);
      const stateIndex = state.momentCreated.findIndex(c => c.id === id);
      if (stateIndex !== -1) {
        dispatch(addProfileViewMomentLike({ key: route.params.arg!, index: stateIndex }));
      }
    }
    if (route.params.mode === 'myProfile') {
      const state = selectMyProfileView(getState());
      const stateIndex = state.momentCreated.findIndex(c => c.id === id);
      if (stateIndex !== -1) {
        dispatch(addMyProfileViewMomentLike({ index: stateIndex }));
      }
    }
    if (route.params.mode === 'nft') {
      const state = selectNFTDetailsView(getState(), route.params.arg!);
      const stateIndex = state.moment.findIndex(c => c.id === id);
      if (stateIndex !== -1) {
        dispatch(addNFTDetailsViewMomentLike({ key: route.params.arg!, index: stateIndex }));
      }
    }
    if (route.params.mode === 'collection') {
      const state = selectCollectionView(getState(), route.params.arg!);
      const stateIndex = state.moment.findIndex(c => c.id === id);
      if (stateIndex !== -1) {
        dispatch(addCollectionViewMomentLike({ key: route.params.arg!, index: stateIndex }));
      }
    }
  };

export const unloadMoment =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearMomentByKey(key));
  };

const loadMomentFromId = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  _getState: () => RootState,
  signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    const momentResponse = await getMomentById(payload.route.params.arg!, signal);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [momentResponse.data],
          loaded: true,
          reqStatus: momentResponse.status,
        },
      }),
    );
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMomentFromFeed = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    if (payload.reload) {
      await dispatch(loadFeedsMoment({ reload: true }) as unknown as AnyAction).unwrap();
      await sleep(1);
    }
    const index = payload.reload ? 0 : payload.route.params.index!;
    const feedMomentState = selectRecentMomentState(getState());
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [feedMomentState.items[index]],
          loaded: true,
          reqStatus: 200,
        },
      }),
    );
    await sleep(1);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          moments: feedMomentState.items,
          momentPagination: {
            checkpoint: feedMomentState.checkpoint,
            version: feedMomentState.reqVersion,
          },
        },
      }),
    );
    await sleep(1);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMomentFromProfile = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    if (payload.reload) {
      const profileState = selectProfileView(getState(), payload.route.params.arg!);
      await dispatch(
        loadProfile({
          route: {
            name: 'Profile',
            key: payload.route.params.arg!,
            params: { mode: 'a', arg: profileState.persona.address },
          },
          reload: true,
          isMyProfile: false,
        }) as unknown as AnyAction,
      ).unwrap();
      await sleep(1);
    }
    const index = payload.reload ? 0 : payload.route.params.index!;
    const profileState = selectProfileView(getState(), payload.route.params.arg!);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [profileState.momentCreated[index]],
          loaded: true,
          reqStatus: 200,
        },
      }),
    );
    await sleep(1);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          moments: profileState.momentCreated,
          momentPagination: {
            checkpoint: profileState.momentPagination.checkpoint,
            version: profileState.momentPagination.version,
          },
        },
      }),
    );
    await sleep(1);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMomentFromMyProfile = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    if (payload.reload) {
      await dispatch(
        loadProfile({
          route: { name: 'Profile', key: '', params: { mode: 'a', arg: '' } },
          reload: true,
          isMyProfile: true,
        }) as unknown as AnyAction,
      ).unwrap();
      await sleep(1);
    }
    const index = payload.reload ? 0 : payload.route.params.index!;
    const profileState = selectMyProfileView(getState());
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [profileState.momentCreated[index]],
          loaded: true,
          reqStatus: 200,
        },
      }),
    );
    await sleep(1);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          moments: profileState.momentCreated,
          momentPagination: {
            checkpoint: profileState.momentPagination.checkpoint,
            version: profileState.momentPagination.version,
          },
        },
      }),
    );
    await sleep(1);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMomentFromNFT = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    if (payload.reload) {
      const nftDetailsState = selectNFTDetailsView(getState(), payload.route.params.arg!);
      await dispatch(
        loadNFTDetails({
          route: {
            name: 'NFTDetails',
            key: payload.route.params.arg!,
            params: { mode: 'id', arg: nftDetailsState.id },
          },
          reload: true,
        }) as unknown as AnyAction,
      ).unwrap();
      await sleep(1);
    }
    const index = payload.reload ? 0 : payload.route.params.index!;
    const nftDetailsState = selectNFTDetailsView(getState(), payload.route.params.arg!);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [nftDetailsState.moment[index]],
          loaded: true,
          reqStatus: 200,
        },
      }),
    );
    await sleep(1);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          moments: nftDetailsState.moment,
          momentPagination: {
            checkpoint: nftDetailsState.momentPagination.checkpoint,
            version: nftDetailsState.momentPagination.version,
          },
        },
      }),
    );
    await sleep(1);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMomentFromCollection = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  try {
    let reloadTime = 0;
    if (payload.reload) {
      Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
      dispatch(showModalLoader());
    }
    if (payload.reload) {
      const collectionState = selectCollectionView(getState(), payload.route.params.arg!);
      await dispatch(
        loadCollection({
          route: {
            name: 'Collection',
            key: payload.route.params.arg!,
            params: { mode: 'id', arg: collectionState.id },
          },
          reload: true,
        }) as unknown as AnyAction,
      ).unwrap();
      await sleep(1);
    }
    const index = payload.reload ? 0 : payload.route.params.index!;
    const collectionState = selectCollectionView(getState(), payload.route.params.arg!);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          ...momentInitialStateItem,
          moments: [collectionState.moment[index]],
          loaded: true,
          reqStatus: 200,
        },
      }),
    );
    await sleep(1);
    dispatch(
      setMomentView({
        key: payload.route.key,
        value: {
          moments: collectionState.moment,
          momentPagination: {
            checkpoint: collectionState.momentPagination.checkpoint,
            version: collectionState.momentPagination.version,
          },
        },
      }),
    );
    await sleep(1);
    if (payload.reload && Platform.OS === 'ios') {
      reloadTime = Date.now() - reloadTime;
      await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setMomentViewLoaded({ key: payload.route.key, value: true }));
  } finally {
    payload.reload && dispatch(hideModalLoader());
  }
};

const loadMoreMomentFromId = async (
  _payload: LoadMomentArgs,
  _dispatch: Dispatch<AnyAction>,
  _getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  // TODO: implement
};

const loadMoreMomentFromFeed = async (
  _payload: LoadMomentArgs,
  _dispatch: Dispatch<AnyAction>,
  _getState: () => RootState,
  _signal: AbortController['signal'],
) => {
  // TODO: implement
};

const loadMoreMomentFromProfile = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  signal: AbortController['signal'],
) => {
  try {
    const profile = selectProfileView(getState(), payload.route.params.arg!);
    const profileMoment = selectProfileViewMomentCreated(getState(), payload.route.params.arg!);
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
          key: payload.route.params.arg!,
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
      dispatch(
        pushMomentView({
          key: payload.route.key,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
    }
  } catch (err: any) {
    handleError(err);
  }
};

const loadMoreMomentFromMyProfile = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  signal: AbortController['signal'],
) => {
  try {
    const myProfileMoment = selectMyProfileViewMomentCreated(getState());
    const myProfileView = selectMyProfileView(getState());
    const offset = myProfileView.momentPagination.checkpoint;
    const version = myProfileView.momentPagination.version;
    if (myProfileMoment.length !== version) {
      const myAddress = await getMyAddress();
      const momentResponse = await getProfileMoment(myAddress, offset, PROFILE_MOMENT_RESPONSE_LIMIT, version, signal);
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
      dispatch(
        pushMomentView({
          key: payload.route.key,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
    }
  } catch (err: any) {
    handleError(err);
  }
};

const loadMoreMomentFromNFT = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  signal: AbortController['signal'],
) => {
  try {
    const nftDetailsState = selectNFTDetailsView(getState(), payload.route.params.arg!);
    const offset = nftDetailsState.momentPagination.checkpoint;
    const version = nftDetailsState.momentPagination.version;
    if (nftDetailsState.moment.length !== version) {
      const momentResponse = await getNFTMoment(nftDetailsState.id, offset, NFT_MOMENT_RESPONSE_LIMIT, version, signal);
      dispatch(
        pushNFTDetailsViewMoment({
          key: payload.route.params.arg!,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
      dispatch(
        pushMomentView({
          key: payload.route.key,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
    }
  } catch (err: any) {
    handleError(err);
  }
};

const loadMoreMomentFromCollection = async (
  payload: LoadMomentArgs,
  dispatch: Dispatch<AnyAction>,
  getState: () => RootState,
  signal: AbortController['signal'],
) => {
  try {
    const collectionState = selectCollectionView(getState(), payload.route.params.arg!);
    const offset = collectionState.momentPagination.checkpoint;
    const version = collectionState.momentPagination.version;
    if (collectionState.moment.length !== version) {
      const momentResponse = await getCollectionMoment(
        collectionState.id,
        offset,
        COLLECTION_MOMENT_RESPONSE_LIMIT,
        version,
        signal,
      );
      dispatch(
        pushCollectionViewMoment({
          key: payload.route.params.arg!,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
      dispatch(
        pushMomentView({
          key: payload.route.key,
          value: momentResponse.data.data,
          pagination: { checkpoint: momentResponse.data.checkpoint, version: momentResponse.data.version },
        }),
      );
    }
  } catch (err: any) {
    handleError(err);
  }
};
