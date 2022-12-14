import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type PayLikeNFTPayload = { id: string; key: string; symbol: string; serial: string };

export const directPayLikeNFT = createAsyncThunk<void, PayLikeNFTPayload, AsyncThunkAPI>(
  'nftDetails/directPayLikeNFT',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: payload.id,
      key: payload.key,
      action: 'likeNFT',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeNft,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeNFTName'),
      description: i18n.t('payment:payLikeNFTDescription', { symbol: payload.symbol, serial: payload.serial }),
      dispatch,
      getState,
      signal,
    });
  },
);
