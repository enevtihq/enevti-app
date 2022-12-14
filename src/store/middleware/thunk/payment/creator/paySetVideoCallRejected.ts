import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, hidePayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { SetVideoCallRejectedUI } from 'enevti-app/types/core/asset/redeemable_nft/set_video_call_rejected_asset';
import { cleanPayment } from '../utils/cleanPayment';

type PaySetVideoCallRejectedPayload = { key: string; nft: NFT; signature: string; publicKey: string };

export const paySetVideoCallRejected = createAsyncThunk<void, PaySetVideoCallRejectedPayload, AsyncThunkAPI>(
  'videoCall/paySetVideoCallRejected',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      dispatch(
        setPaymentStatus({
          id: payload.nft.id,
          key: payload.key,
          action: 'setVideoCallRejected',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      const transactionPayload: AppTransaction<SetVideoCallRejectedUI> =
        await createTransaction<SetVideoCallRejectedUI>(
          redeemableNftModule.moduleID,
          redeemableNftModule.setVideoCallRejected,
          { id: payload.nft.id, signature: payload.signature, publicKey: payload.publicKey },
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
            type: 'setVideoCallRejected',
            icon: iconMap.setVideoCallRejected,
            name: i18n.t('payment:setVideoCallRejected'),
            description: i18n.t('payment:setVideoCallRejectedDescription', {
              nft: `${payload.nft.symbol}#${payload.nft.serial}`,
            }),
            details: i18n.t('payment:setVideoCallRejectedDetails'),
            amount: '0',
            currency: COIN_NAME,
            payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
            meta: '',
          },
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.nft.id,
          key: payload.key,
          action: 'setVideoCallRejected',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
