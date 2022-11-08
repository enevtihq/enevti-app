import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, hidePayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { CommentCollectionUI } from 'enevti-app/types/core/asset/redeemable_nft/comment_collection_asset';
import { getCollectionIdFromRouteParam } from 'enevti-app/service/enevti/collection';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { getCommentKey } from '../../ui/view/comment';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';

type CommentRoute = RouteProp<RootStackParamList, 'Comment'>;
type PayCommentCollectionPayload = { route: CommentRoute; comment: string };

export const payCommentCollection = createAsyncThunk<void, PayCommentCollectionPayload, AsyncThunkAPI>(
  'commentView/payCommentCollection',
  async (payload, { dispatch, signal }) => {
    try {
      const collectionId = await getCollectionIdFromRouteParam(payload.route.params, signal);
      const transactionPayload: AppTransaction<CommentCollectionUI> = await createTransaction<CommentCollectionUI>(
        redeemableNftModule.moduleID,
        redeemableNftModule.commentCollection,
        { id: collectionId, cid: makeDummyIPFS() },
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
            type: 'commentCollection',
            icon: iconMap.commentFill,
            name: i18n.t('payment:payCommentCollection'),
            description: i18n.t('payment:payCommentCollectionDescription'),
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
          key: getCommentKey(payload.route, 'common'),
          action: 'commentCollection',
          type: 'initiated',
          message: '',
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.route.params.arg,
          key: getCommentKey(payload.route, 'common'),
          action: 'commentCollection',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
