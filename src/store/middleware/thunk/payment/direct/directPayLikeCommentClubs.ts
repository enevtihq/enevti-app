import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayLikeCommentClubsPayload = { route: CommentRoute; id: string; key: string; target: string };

export const directPayLikeCommentClubs = createAsyncThunk<void, PayLikeCommentClubsPayload, AsyncThunkAPI>(
  'commentView/directPayLikeCommentClubs',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: payload.id,
      key: payload.key,
      action: 'likeCommentClubs',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeCommentClubs,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeCommentClubsName'),
      description: i18n.t('payment:payLikeCommentClubsDescription', { name: payload.target }),
      dispatch,
      getState,
      signal,
    });
  },
);
