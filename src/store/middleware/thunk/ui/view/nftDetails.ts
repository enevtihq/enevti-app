import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNFTbyRouteParam, getNFTActivity } from 'enevti-app/service/enevti/nft';
import {
  clearNFTDetailsByKey,
  selectNFTDetailsView,
  setNFTDetailsLoaded,
  setNFTDetailsView,
  pushNFTDetailsViewActivity,
  nftDetailsInitialStateItem,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { NFT_ACTIVITY_INITIAL_LENGTH, NFT_ACTIVITY_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';
import { Platform } from 'react-native';
import { IOS_MIN_RELOAD_TIME } from 'enevti-app/utils/constant/reload';
import sleep from 'enevti-app/utils/dummy/sleep';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route'];
type loadNFTArgs = { route: NFTDetailsRoute; reload: boolean };

export const loadNFTDetails = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadNFTDetails',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      let reloadTime = 0;
      if (reload) {
        Platform.OS === 'ios' ? (reloadTime = Date.now()) : {};
        dispatch(showModalLoader());
      }
      const nftResponse = await getNFTbyRouteParam(route.params, true, signal);
      if (reload && Platform.OS === 'ios') {
        reloadTime = Date.now() - reloadTime;
        await sleep(IOS_MIN_RELOAD_TIME - reloadTime);
      }
      dispatch(
        setNFTDetailsView({
          key: route.key,
          value: {
            ...nftDetailsInitialStateItem,
            ...nftResponse.data,
            version: Date.now(),
            activityPagination: {
              checkpoint: NFT_ACTIVITY_INITIAL_LENGTH,
              version: nftResponse.version.activity,
            },
            reqStatus: nftResponse.status,
            loaded: true,
          },
        }),
      );
    } catch (err: any) {
      handleError(err);
      dispatch(setNFTDetailsLoaded({ key: route.key, value: true }));
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreActivity = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadMoreActivity',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const nftView = selectNFTDetailsView(getState(), route.key);
      const offset = nftView.activityPagination.checkpoint;
      const version = nftView.activityPagination.version;
      if (nftView.activity.length !== version) {
        const activityResponse = await getNFTActivity(nftView.id, offset, NFT_ACTIVITY_RESPONSE_LIMIT, version, signal);
        dispatch(
          pushNFTDetailsViewActivity({
            key: route.key,
            value: activityResponse.data.data,
            pagination: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadNFTDetails =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearNFTDetailsByKey(key));
  };
