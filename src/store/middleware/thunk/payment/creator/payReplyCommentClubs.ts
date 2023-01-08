import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { ReplyCommentClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/reply_comment_clubs_asset';
import { getCommentKey } from '../../ui/view/comment';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import { cleanPayment } from '../utils/cleanPayment';
import onPaymentCreatorError from '../utils/onPaymentCreatorError';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayReplyCommentClubsPayload = { route: CommentRoute; commentId: string; reply: string };

export const payReplyCommentClubs = createAsyncThunk<void, PayReplyCommentClubsPayload, AsyncThunkAPI>(
  'commentView/payReplyCommentClubs',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      const transactionPayload: AppTransaction<ReplyCommentClubsUI> = await createTransaction<ReplyCommentClubsUI>(
        redeemableNftModule.moduleID,
        redeemableNftModule.replyCommentClubs,
        { id: payload.commentId, cid: makeDummyIPFS() },
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

      dispatch(
        setPaymentState({
          fee: { gas: gasFee, base: baseFee, platform: '0', priority: 'normal', loaded: true },
          action: {
            loaded: true,
            type: 'replyCommentClubs',
            icon: iconMap.commentFill,
            name: i18n.t('payment:payReplyCommentClubs'),
            description: i18n.t('payment:payReplyCommentClubsDescription'),
            amount: '0',
            currency: COIN_NAME,
            payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
            meta: payload.reply,
          },
          mode: 'compact',
        }),
      );
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
      await onPaymentCreatorError({
        dispatch,
        err,
        id: payload.commentId,
        key: getCommentKey(payload.route, 'clubs'),
        action: 'replyCommentClubs',
      });
    }
  },
);
