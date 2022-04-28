import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import {
  attachFee,
  calculateBaseFee,
  calculateGasFee,
  createTransaction,
} from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { stakingModule } from 'enevti-app/utils/constant/transaction';
import { RegisterUsernameUI } from 'enevti-app/types/core/asset/chain/register_username';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { getMyProfile } from 'enevti-app/service/enevti/profile';

type PayRegisterUsernamePayload = string;

export const payRegisterUsername = createAsyncThunk<
  void,
  PayRegisterUsernamePayload,
  AsyncThunkAPI
>('setting/payRegisterUsername', async (payload, { dispatch, signal }) => {
  try {
    dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
    dispatch(showPayment());
    await getMyProfile(true);

    const transactionPayload: AppTransaction<RegisterUsernameUI> =
      await createTransaction<RegisterUsernameUI>(
        stakingModule.moduleID,
        stakingModule.registerDelegate,
        { username: payload },
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

    dispatch(setPaymentFee({ gas: gasFee, platform: '0' }));
    dispatch(
      setPaymentAction({
        type: 'registerUsername',
        icon: iconMap.username,
        name: i18n.t('payment:payRegisterUsernameName'),
        description: i18n.t('payment:payRegisterUsernameDescription', {
          username: payload,
        }),
        amount: BigInt(baseFee).toString(),
        currency: COIN_NAME,
        payload: JSON.stringify(
          attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString()),
        ),
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
});
