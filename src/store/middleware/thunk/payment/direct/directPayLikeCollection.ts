import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type PayLikeCollectionPayload = { id: string; key: string; name: string };

export const directPayLikeCollection = createAsyncThunk<void, PayLikeCollectionPayload, AsyncThunkAPI>(
  'collection/directPayLikeCollection',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: payload.id,
      key: payload.key,
      action: 'likeCollection',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeCollection,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeCollectionName'),
      description: i18n.t('payment:payLikeCollectionDescription', { name: payload.name }),
      dispatch,
      getState,
      signal,
    });
  },
);
