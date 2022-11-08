import {
  resetPaymentState,
  resetPaymentStatusType,
  setPaymentState,
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
import { LikeCollectionUI } from 'enevti-app/types/core/asset/redeemable_nft/like_collection_asset';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

type PayLikeCollectionPayload = { id: string; key: string; name: string };

export const directPayLikeCollection = createAsyncThunk<void, PayLikeCollectionPayload, AsyncThunkAPI>(
  'collection/directPayLikeCollection',
  async (payload, { dispatch, signal, getState }) => {
    try {
      dispatch(
        setPaymentStatus({
          id: payload.id,
          key: payload.key,
          action: 'likeCollection',
          type: 'initiated',
          message: '',
        }),
      );

      const transactionPayload: AppTransaction<LikeCollectionUI> = await createTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.likeCollection,
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

      dispatch(
        setPaymentState({
          fee: { gas: gasFee, base: baseFee, platform: '0', priority: 'normal', loaded: true },
          action: {
            loaded: true,
            type: 'likeCollection',
            icon: iconMap.likeActive,
            name: i18n.t('payment:payLikeCollectionName'),
            description: i18n.t('payment:payLikeCollectionDescription', { name: payload.name }),
            amount: '0',
            currency: COIN_NAME,
            payload: '',
            meta: '',
          },
        }),
      );

      dispatch(
        setPaymentStatus({ id: payload.id, key: payload.key, action: 'likeCollection', type: 'process', message: '' }),
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
            action: 'likeCollection',
            type: 'success',
            message: response.data.transactionId,
          }),
        );
      } else {
        dispatch(
          setPaymentStatus({
            id: payload.id,
            key: payload.key,
            action: 'likeCollection',
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
          action: 'likeCollection',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
