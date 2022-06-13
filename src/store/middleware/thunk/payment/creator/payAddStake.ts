import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
  setPaymentPriority,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { NFTPrice } from 'enevti-app/types/core/chain/nft/NFTPrice';
import { handleError } from 'enevti-app/utils/error/handle';
import { AddStakeUI } from 'enevti-app/types/core/asset/chain/add_stake_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { stakingModule } from 'enevti-app/utils/constant/transaction';

type PayAddStakePayload = { persona: Persona; stake: NFTPrice };

export const payAddStake = createAsyncThunk<void, PayAddStakePayload, AsyncThunkAPI>(
  'stakePool/payAddStake',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
      dispatch(showPayment());

      const transactionPayload: AppTransaction<AddStakeUI> = await createTransaction<AddStakeUI>(
        stakingModule.moduleID,
        stakingModule.vote,
        { votes: [{ delegateAddress: payload.persona.address, amount: payload.stake.amount }] },
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
          type: 'addStake',
          icon: iconMap.stake,
          name: i18n.t('payment:payAddStakeName'),
          description: i18n.t('payment:payAddStakeDescription', {
            account: parsePersonaLabel(payload.persona),
          }),
          amount: (BigInt(transactionPayload.asset.votes[0].amount) + BigInt(baseFee)).toString(),
          currency: payload.stake.currency,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
          meta: '',
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(
        setPaymentStatus({
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
