import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { NFTPrice } from 'enevti-app/types/core/chain/nft/NFTPrice';
import { handleError } from 'enevti-app/utils/error/handle';
import { AddStakeUI } from 'enevti-app/types/core/asset/add_stake_asset';
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
        {
          address: payload.persona.address,
          amount: payload.stake,
        },
        '0',
        signal,
      );
      const gasFee = await calculateGasFee(transactionPayload, signal);
      if (!gasFee) {
        throw Error(i18n.t('eror:transactionPreparationFailed'));
      }

      dispatch(setPaymentFee({ gas: gasFee, platform: '0' }));
      dispatch(
        setPaymentAction({
          type: 'addStake',
          icon: iconMap.stake,
          name: i18n.t('payment:payAddStakeName'),
          description: i18n.t('payment:payAddStakeDescription', {
            account: parsePersonaLabel(payload.persona),
          }),
          amount: transactionPayload.asset.amount.amount,
          currency: transactionPayload.asset.amount.currency,
          payload: JSON.stringify(transactionPayload),
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
