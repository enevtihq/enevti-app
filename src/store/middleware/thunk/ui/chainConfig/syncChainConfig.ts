import { handleError } from 'enevti-app/utils/error/handle';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getConfigSocialRaffle } from 'enevti-app/service/enevti/config';
import { setSocialRaffleChainConfig } from 'enevti-app/store/slices/entities/chainConfig/socialRaffle';

export const syncChainConfig = createAsyncThunk<void, undefined, AsyncThunkAPI>(
  'chainConfig/syncChainConfig',
  async (_, { dispatch, signal }) => {
    try {
      const socialRaffleResponse = await getConfigSocialRaffle(signal);
      if (socialRaffleResponse.status === 200) {
        dispatch(setSocialRaffleChainConfig(socialRaffleResponse.data));
      }
    } catch (err: any) {
      handleError(err, undefined, true);
    }
  },
);
