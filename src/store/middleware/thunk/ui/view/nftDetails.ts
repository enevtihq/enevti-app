import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNFTbyRouteParam } from 'enevti-app/service/enevti/nft';
import {
  clearNFTDetailsByKey,
  initNFTDetailsView,
  setNFTDetailsLoaded,
  setNFTDetailsReqStatus,
  setNFTDetailsView,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import {
  addNFTDetailsUIManager,
  selectUIManager,
  subtractNFTDetailsUIManager,
} from 'enevti-app/store/slices/ui/view/manager';

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
        dispatch(initNFTDetailsView(routeParam.arg));
        dispatch(setNFTDetailsView({ key: routeParam.arg, value: { ...nftResponse.data, version: Date.now() } }));
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

export const unloadNFTDetails =
  (key: string): AppThunk =>
  (dispatch, getState) => {
    const uiManager = selectUIManager(getState());
    if (!uiManager.nftDetails[key]) {
      dispatch(clearNFTDetailsByKey(key));
    }
    dispatch(subtractNFTDetailsUIManager(key));
  };
