import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppTransaction } from 'enevti-types/service/transaction';
import { tokenModule } from 'enevti-app/utils/constant/transaction';
import { TransferTokenUI } from 'enevti-types/asset/token/transfer_asset';
import { base32ToAddress } from 'enevti-app/service/enevti/persona';
import { COIN_NAME, getCoinName } from 'enevti-app/utils/constant/identifier';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import { cleanPayment } from '../utils/cleanPayment';
import onPaymentCreatorError from '../utils/onPaymentCreatorError';

type PayTransferTokenPayload = { key: string; base32: string; amount: string };

export const payTransferToken = createAsyncThunk<void, PayTransferTokenPayload, AsyncThunkAPI>(
  'wallet/payTransferToken',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      dispatch(
        setPaymentStatus({
          id: payload.base32,
          key: payload.key,
          action: 'transferToken',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      const transactionPayload: AppTransaction<TransferTokenUI> = await createTransaction(
        tokenModule.moduleID,
        tokenModule.transfer,
        {
          amount: completeTokenUnit(payload.amount),
          recipientAddress: base32ToAddress(payload.base32),
          data: '',
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
            type: 'transferToken',
            icon: iconMap.transfer,
            name: i18n.t('payment:payTransferToken', { coin: getCoinName() }),
            description: i18n.t('payment:payTransferTokenDescription', { base32: payload.base32 }),
            amount: completeTokenUnit(payload.amount),
            currency: COIN_NAME,
            payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
            meta: '',
          },
        }),
      );
    } catch (err) {
      await onPaymentCreatorError({
        dispatch,
        err,
        id: payload.base32,
        key: payload.key,
        action: 'transferToken',
      });
    }
  },
);
