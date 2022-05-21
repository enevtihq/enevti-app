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
import {
  addNFTDetailsUIManager,
  selectUIManager,
  subtractNFTDetailsUIManager,
} from 'enevti-app/store/slices/ui/view/manager';
import { NFT_ACTIVITY_RESPONSE_LIMIT } from 'enevti-app/utils/constant/limit';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route']['params'];
type loadNFTArgs = { routeParam: NFTDetailsRoute; reload: boolean };

export const loadNFTDetails = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadNFTDetails',
  async ({ routeParam, reload = false }, { dispatch, getState, signal }) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.nftDetails[routeParam.arg]) {
      try {
        reload && dispatch(showModalLoader());
        const nftResponse = await getNFTbyRouteParam(routeParam, signal);
        const activityResponse = await getNFTInitialActivity(nftResponse.data.id, signal);
        dispatch(initNFTDetailsView(routeParam.arg));
        dispatch(
          setNFTDetailsView({
            key: routeParam.arg,
            value: { ...nftResponse.data, activity: activityResponse.data.data, version: Date.now() },
          }),
        );
        dispatch(
          setNFTDetailsViewActivityPagination({
            key: routeParam.arg,
            value: { checkpoint: activityResponse.data.checkpoint, version: activityResponse.data.version },
          }),
        );
        dispatch(setNFTDetailsReqStatus({ key: routeParam.arg, value: nftResponse.status }));
      } catch (err: any) {
        handleError(err);
      } finally {
        dispatch(setNFTDetailsLoaded({ key: routeParam.arg, value: true }));
        reload && dispatch(hideModalLoader());
      }
    }
    dispatch(addNFTDetailsUIManager(routeParam.arg));
  },
);

export const loadMoreActivity = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadMoreActivity',
  async ({ routeParam }, { dispatch, getState, signal }) => {
    try {
      const nftView = selectNFTDetailsView(getState(), routeParam.arg);
      const offset = nftView.activityPagination.checkpoint;
      const version = nftView.activityPagination.version;
      if (nftView.activity.length !== version) {
        const activityResponse = await getNFTActivity(nftView.id, offset, NFT_ACTIVITY_RESPONSE_LIMIT, version, signal);
        dispatch(pushNFTDetailsViewActivity({ key: routeParam.arg, value: activityResponse.data.data }));
        dispatch(
          setNFTDetailsViewActivityPagination({
            key: routeParam.arg,
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
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.nftDetails[key]) {
      dispatch(clearNFTDetailsByKey(key));
    }
    dispatch(subtractNFTDetailsUIManager(key));
  };
