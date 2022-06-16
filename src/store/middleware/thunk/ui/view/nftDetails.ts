import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNFTbyRouteParam, getNFTInitialActivity, getNFTActivity } from 'enevti-app/service/enevti/nft';
import {
  clearNFTDetailsByKey,
  initNFTDetailsView,
  selectNFTDetailsView,
  setNFTDetailsLoaded,
  setNFTDetailsReqStatus,
  setNFTDetailsView,
  setNFTDetailsViewActivityPagination,
  pushNFTDetailsViewActivity,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { NFT_ACTIVITY_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route'];
type loadNFTArgs = { route: NFTDetailsRoute; reload: boolean };

export const loadNFTDetails = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadNFTDetails',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const nftResponse = await getNFTbyRouteParam(route.params, signal);
      const activityResponse = await getNFTInitialActivity(nftResponse.data.id, signal);
      dispatch(initNFTDetailsView(route.key));
      dispatch(
        setNFTDetailsView({
          key: route.key,
          value: { ...nftResponse.data, activity: activityResponse.data.data, version: Date.now() },
        }),
      );
      dispatch(
        setNFTDetailsViewActivityPagination({
          key: route.key,
          value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
        }),
      );
      dispatch(setNFTDetailsReqStatus({ key: route.key, value: nftResponse.status }));
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setNFTDetailsLoaded({ key: route.key, value: true }));
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
        dispatch(pushNFTDetailsViewActivity({ key: route.key, value: activityResponse.data.data }));
        dispatch(
          setNFTDetailsViewActivityPagination({
            key: route.key,
            value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
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
