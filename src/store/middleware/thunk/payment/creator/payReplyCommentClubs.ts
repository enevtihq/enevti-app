import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
  setPaymentPriority,
  setPaymentMode,
  hidePayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { ReplyCommentClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/reply_comment_clubs_asset';
import { getCommentKey } from '../../ui/view/comment';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayReplyCommentClubsPayload = { route: CommentRoute; commentId: string; reply: string };

export const payReplyCommentClubs = createAsyncThunk<void, PayReplyCommentClubsPayload, AsyncThunkAPI>(
  'commentView/payReplyCommentClubs',
  async (payload, { dispatch, signal }) => {
    try {
      const transactionPayload: AppTransaction<ReplyCommentClubsUI> = await createTransaction<ReplyCommentClubsUI>(
        redeemableNftModule.moduleID,
        redeemableNftModule.replyCommentClubs,
        { id: payload.commentId, text: payload.reply },
        '0',
        signal,
      );
      const baseFee = await calculateBaseFee(transactionPayload, signal);
      if (!baseFee) {
        throw Error(i18n.t('error:transactionPreparationFailed'));
      }
      const gasFee = await calculateGasFee(attachFee(transactionPayload, baseFee), signal);
      if (!gasFee) {
        throw Error(i18n.t('error:transactionPreparationFailed'));
      }

      dispatch(setPaymentFee({ gas: gasFee, base: baseFee, platform: '0' }));
      dispatch(setPaymentPriority('normal'));
      dispatch(
        setPaymentAction({
          type: 'replyCommentClubs',
          icon: iconMap.commentFill,
          name: i18n.t('payment:payReplyCommentClubs'),
          description: i18n.t('payment:payReplyCommentClubsDescription'),
          amount: '0',
          currency: COIN_NAME,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
          meta: '',
        }),
      );
      dispatch(setPaymentMode('compact'));
      dispatch(showPayment());

      dispatch(
        setPaymentStatus({
          id: payload.commentId,
          key: getCommentKey(payload.route, 'clubs'),
          action: 'replyCommentClubs',
          type: 'initiated',
          message: '',
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.commentId,
          key: getCommentKey(payload.route, 'clubs'),
          action: 'replyCommentClubs',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
