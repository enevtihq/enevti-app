import {
  resetPaymentState,
  resetPaymentStatusType,
  setPaymentAction,
  setPaymentFee,
  setPaymentStatus,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import {
  attachFee,
  calculateBaseFee,
  calculateGasFee,
  createTransaction,
  postTransaction,
} from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { LikeCommentClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/like_comment_clubs_asset';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayLikeCommentClubsPayload = { route: CommentRoute; id: string; key: string; target: string };

export const directPayLikeCommentClubs = createAsyncThunk<void, PayLikeCommentClubsPayload, AsyncThunkAPI>(
  'commentView/directPayLikeCommentClubs',
  async (payload, { dispatch, signal, getState }) => {
    try {
      dispatch(
        setPaymentStatus({
          id: payload.id,
          key: payload.key,
          action: 'likeCommentClubs',
          type: 'initiated',
          message: '',
        }),
      );

      const transactionPayload: AppTransaction<LikeCommentClubsUI> = await createTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.likeCommentClubs,
        {
          id: payload.id,
        },
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

      dispatch(setPaymentFee({ gas: gasFee, base: baseFee, platform: '0', priority: 'normal' }));
      dispatch(
        setPaymentAction({
          type: 'likeCommentClubs',
          icon: iconMap.likeActive,
          name: i18n.t('payment:payLikeCommentClubsName'),
          description: i18n.t('payment:payLikeCommentClubsDescription', { name: payload.target }),
          amount: '0',
          currency: COIN_NAME,
          payload: '',
          meta: '',
        }),
      );

      dispatch(
        setPaymentStatus({
          id: payload.id,
          key: payload.key,
          action: 'likeCommentClubs',
          type: 'process',
          message: '',
        }),
      );

      const myProfile = selectMyProfileCache(getState());
      const paymentTotalAmount = BigInt(gasFee) + BigInt(baseFee);
      const balanceEnough = BigInt(myProfile.balance) > paymentTotalAmount;

      if (!balanceEnough) {
        dispatch(showSnackbar({ mode: 'error', text: i18n.t('payment:notEnoughBalance') }));
        dispatch(resetPaymentState());
        dispatch(resetPaymentStatusType());
        return;
      }

      const response = await postTransaction(
        attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString()),
      );
      if (response.status === 200) {
        dispatch(
          setPaymentStatus({
            id: payload.id,
            key: payload.key,
            action: 'likeCommentClubs',
            type: 'success',
            message: response.data.transactionId,
          }),
        );
      } else {
        dispatch(
          setPaymentStatus({
            id: payload.id,
            key: payload.key,
            action: 'likeCommentClubs',
            type: 'error',
            message: response.data,
          }),
        );
      }
    } catch (err) {
      handleError(err);
      dispatch(
        setPaymentStatus({
          id: payload.id,
          key: payload.key,
          action: 'likeCommentClubs',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
