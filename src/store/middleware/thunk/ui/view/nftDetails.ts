import { handleError } from 'enevti-app/utils/error/handle';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNFT } from 'enevti-app/service/enevti/nft';
import {
  clearNFTDetailsById,
  setNFTDetailsLoaded,
  setNFTDetailsView,
} from 'enevti-app/store/slices/ui/view/nftDetails';

type loadNFTArgs = { id: string; reload: boolean };

export const loadNFTDetails = createAsyncThunk<
  void,
  loadNFTArgs,
  AsyncThunkAPI
>(
  'nftDetailsView/loadNFTDetails',
  async ({ id, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      const nftReponse = await getNFT(id, signal);
      if (nftReponse) {
        dispatch(setNFTDetailsView(nftReponse));
        dispatch(setNFTDetailsLoaded({ id, value: true }));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const unloadNFTDetails =
  (id: string): AppThunk =>
  dispatch => {
    dispatch(clearNFTDetailsById(id));
  };
