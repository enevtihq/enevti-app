import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { calculateGasFee } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { NFTPrice } from 'enevti-app/types/core/chain/nft/NFTPrice';
import { handleError } from 'enevti-app/utils/error/handle';
import { AddStakeAsset } from 'enevti-app/types/core/asset/add_stake_asset';

type PayAddStakePayload = { persona: Persona; stake: NFTPrice };

export const payAddStake = createAsyncThunk<
  void,
  PayAddStakePayload,
  AsyncThunkAPI
>('stakePool/payAddStake', async (payload, { dispatch, signal }) => {
  try {
    dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
    dispatch(showPayment());

    const transactionPayload: AddStakeAsset = {
      address: payload.persona.address,
      amount: payload.stake,
    };
    const gasFee = await calculateGasFee(transactionPayload, signal);

    dispatch(setPaymentFee({ gas: gasFee, platform: BigInt(0) }));
    dispatch(
      setPaymentAction({
        type: 'addStake',
        icon: iconMap.stake,
        name: i18n.t('payment:payAddStakeName'),
        description: i18n.t('payment:payAddStakeDescription', {
          account: parsePersonaLabel(payload.persona),
        }),
        amount: BigInt(transactionPayload.amount.amount),
        currency: transactionPayload.amount.currency,
        payload: JSON.stringify(payload),
      }),
    );
  } catch (err) {
    handleError(err);
  }
});
