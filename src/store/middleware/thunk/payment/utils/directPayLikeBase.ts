import {
  resetPaymentState,
  resetPaymentStatusType,
  setPaymentState,
  setPaymentStatus,
} from 'enevti-app/store/slices/payment';
import { RootState } from 'enevti-app/store/state';
import {
  attachFee,
  calculateBaseFee,
  calculateGasFee,
  createTransaction,
  postTransaction,
} from 'enevti-app/service/enevti/transaction';
import { handleError } from 'enevti-app/utils/error/handle';
import { Dispatch } from '@reduxjs/toolkit';
import i18n from 'enevti-app/translations/i18n';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import AppLikeReadyInstance from 'enevti-app/utils/app/likeReady';

export type DirectPayLikeBaseProps = {
  id: string;
  key: string;
  action: PaymentStatus['action'];
  moduleID: number;
  assetID: number;
  payload: Record<string, any>;
  icon: string;
  name: string;
  description: string;
  dispatch: Dispatch;
  getState: () => RootState;
  signal?: AbortController['signal'];
};

export const directPayLikeBase = async ({
  dispatch,
  id,
  key,
  action,
  moduleID,
  assetID,
  payload,
  icon,
  name,
  description,
  getState,
  signal,
}: DirectPayLikeBaseProps) => {
  try {
    AppLikeReadyInstance.setNotReady();
    dispatch(
      setPaymentStatus({
        id,
        key,
        action,
        type: 'initiated',
        message: '',
      }),
    );

    const transactionPayload = await createTransaction(moduleID, assetID, payload, '0', signal);
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
          type: action,
          icon,
          name,
          description,
          amount: '0',
          currency: COIN_NAME,
          payload: '',
          meta: '',
        },
      }),
    );

    dispatch(
      setPaymentStatus({
        id,
        key,
        action,
        type: 'process',
        message: '',
      }),
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
          id,
          key,
          action,
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(
        setPaymentStatus({
          id,
          key,
          action,
          type: 'error',
          message: response.data,
        }),
      );
    }
  } catch (err) {
    handleError(err);
    dispatch(
      setPaymentStatus({
        id,
        key,
        action,
        type: 'error',
        message: (err as Record<string, any>).message.toString(),
      }),
    );
  } finally {
    await AppLikeReadyInstance.awaitLikeReady();
  }
};
