import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type PayLikeMomentPayload = { id: string; key: string; target: string };

export const directPayLikeMoment = createAsyncThunk<void, PayLikeMomentPayload, AsyncThunkAPI>(
  'moment/directPayLikeMoment',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: payload.id,
      key: payload.key,
      action: 'likeMoment',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeMoment,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeMomentName'),
      description: i18n.t('payment:payLikeMomentDescription', { name: payload.target }),
      dispatch,
      getState,
      signal,
    });
  },
);
