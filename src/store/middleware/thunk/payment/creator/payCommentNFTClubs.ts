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
import { getNFTIdFromRouteParam } from 'enevti-app/service/enevti/nft';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { CommentNFTClubsUI } from 'enevti-app/types/core/asset/redeemable_nft/comment_nft_clubs_asset';
import { getCommentKey } from '../../ui/view/comment';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import { cleanPayment } from '../utils/cleanPayment';
import onPaymentCreatorError from '../utils/onPaymentCreatorError';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayCommentNFTClubsPayload = { route: CommentRoute; comment: string };

export const payCommentNFTClubs = createAsyncThunk<void, PayCommentNFTClubsPayload, AsyncThunkAPI>(
  'commentView/payCommentNFTClubs',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      const nftId = await getNFTIdFromRouteParam(payload.route.params, signal);
      const transactionPayload: AppTransaction<CommentNFTClubsUI> = await createTransaction<CommentNFTClubsUI>(
        redeemableNftModule.moduleID,
        redeemableNftModule.commentNftClubs,
        { id: nftId, cid: makeDummyIPFS() },
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
            type: 'commentNFTClubs',
            icon: iconMap.commentFill,
            name: i18n.t('payment:payCommentNFTClubs'),
            description: i18n.t('payment:payCommentNFTClubsDescription'),
            amount: '0',
            currency: COIN_NAME,
            payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
            meta: payload.comment,
          },
          mode: 'compact',
        }),
      );
      dispatch(showPayment());

      dispatch(
        setPaymentStatus({
          id: payload.route.params.arg,
          key: getCommentKey(payload.route, 'clubs'),
          action: 'commentNFTClubs',
          type: 'initiated',
          message: '',
        }),
      );
    } catch (err) {
      await onPaymentCreatorError({
        dispatch,
        err,
        id: payload.route.params.arg,
        key: getCommentKey(payload.route, 'clubs'),
        action: 'commentNFTClubs',
      });
    }
  },
);
