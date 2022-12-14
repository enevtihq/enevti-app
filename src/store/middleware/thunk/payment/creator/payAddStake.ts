import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, hidePayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { NFTPrice } from 'enevti-app/types/core/chain/nft/NFTPrice';
import { handleError } from 'enevti-app/utils/error/handle';
import { AddStakeUI } from 'enevti-app/types/core/asset/chain/add_stake_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { stakingModule } from 'enevti-app/utils/constant/transaction';
import { cleanPayment } from '../utils/cleanPayment';

type PayAddStakePayload = { key: string; persona: Persona; stake: NFTPrice };

export const payAddStake = createAsyncThunk<void, PayAddStakePayload, AsyncThunkAPI>(
  'stakePool/payAddStake',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      dispatch(
        setPaymentStatus({
          id: payload.persona.address,
          key: payload.key,
          action: 'addStake',
          type: 'initiated',
          message: '',
        }),
      );
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

      dispatch(
        setPaymentState({
          fee: { gas: gasFee, base: baseFee, platform: '0', priority: 'normal', loaded: true },
          action: {
            loaded: true,
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
          },
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.persona.address,
          key: payload.key,
          action: 'addStake',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
