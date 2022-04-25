import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNFTbyRouteParam } from 'enevti-app/service/enevti/nft';
import {
  clearNFTDetailsByKey,
  setNFTDetailsLoaded,
  setNFTDetailsView,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type NFTDetailsRoute = StackScreenProps<RootStackParamList, 'NFTDetails'>['route']['params'];
type loadNFTArgs = { routeParam: NFTDetailsRoute; reload: boolean };

export const loadNFTDetails = createAsyncThunk<void, loadNFTArgs, AsyncThunkAPI>(
  'nftDetailsView/loadNFTDetails',
  async ({ routeParam, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const nftResponse = await getNFTbyRouteParam(routeParam, signal);
      if (nftResponse !== undefined) {
        dispatch(setNFTDetailsView({ key: routeParam.arg, value: nftResponse }));
        dispatch(setNFTDetailsLoaded({ key: routeParam.arg, value: true }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadNFTDetails =
  (key: string): AppThunk =>
  dispatch => {
    dispatch(clearNFTDetailsByKey(key));
  };
