import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayLikeCommentPayload = { route: CommentRoute; id: string; key: string; target: string };

export const directPayLikeComment = createAsyncThunk<void, PayLikeCommentPayload, AsyncThunkAPI>(
  'commentView/directPayLikeComment',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: payload.id,
      key: payload.key,
      action: 'likeComment',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeComment,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeCommentName'),
      description: i18n.t('payment:payLikeCommentDescription', { name: payload.target }),
      dispatch,
      getState,
      signal,
    });
  },
);
