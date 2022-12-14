import { AsyncThunkAPI } from 'enevti-app/store/state';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { addDirectPayLikeJob } from 'enevti-app/utils/background/worker/directPayLikeWorker';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayLikeReplyClubsPayload = {
  route: CommentRoute;
  id: string;
  commentIndex: number;
  replyIndex: number;
  key: string;
  target: string;
};

export const directPayLikeReplyClubs = createAsyncThunk<void, PayLikeReplyClubsPayload, AsyncThunkAPI>(
  'commentView/directPayLikeReplyClubs',
  async (payload, { dispatch, signal, getState }) => {
    await addDirectPayLikeJob({
      id: `${payload.commentIndex}:${payload.replyIndex}`,
      key: payload.key,
      action: 'likeReplyClubs',
      moduleID: redeemableNftModule.moduleID,
      assetID: redeemableNftModule.likeReplyClubs,
      payload: { id: payload.id },
      icon: iconMap.likeActive,
      name: i18n.t('payment:payLikeReplyClubsName'),
      description: i18n.t('payment:payLikeReplyClubsDescription', { name: payload.target }),
      dispatch,
      getState,
      signal,
    });
  },
);
