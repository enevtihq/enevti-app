import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
  setPaymentPriority,
  hidePayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { SetVideoCallAnsweredUI } from 'enevti-app/types/core/asset/redeemable_nft/set_video_call_answered_asset';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { NFT } from 'enevti-app/types/core/chain/nft';

type PaySetVideoCallAnsweredPayload = { key: string; nft: NFT };

export const paySetVideoCallAnswered = createAsyncThunk<void, PaySetVideoCallAnsweredPayload, AsyncThunkAPI>(
  'videoCall/paySetVideoCallAnswered',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(
        setPaymentStatus({
          id: payload.nft.id,
          key: payload.key,
          action: 'setVideoCallAnswered',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      const transactionPayload: AppTransaction<SetVideoCallAnsweredUI> =
        await createTransaction<SetVideoCallAnsweredUI>(
          redeemableNftModule.moduleID,
          redeemableNftModule.setVideoCallAnswered,
          { id: payload.nft.id },
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
          type: 'setVideoCallAnswered',
          icon: iconMap.setVideoCallAnswered,
          name: i18n.t('payment:setVideoCallAnswered'),
          description: i18n.t('payment:setVideoCallAnsweredDescription', {
            nft: `${payload.nft.symbol}#${payload.nft.serial}`,
          }),
          details: i18n.t('payment:setVideoCallAnsweredDetails'),
          amount: '0',
          currency: COIN_NAME,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
          meta: '',
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.nft.id,
          key: payload.key,
          action: 'setVideoCallAnswered',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
