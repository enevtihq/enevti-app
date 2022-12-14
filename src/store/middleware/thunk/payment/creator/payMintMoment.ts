import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { setPaymentStatus, showPayment, hidePayment, setPaymentState } from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { CreateMomentState } from 'enevti-app/store/slices/queue/moment/create';
import { MintMomentUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_moment_asset';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { cleanPayment } from '../utils/cleanPayment';

type PayMintMomentPayload = { key: string; data: CreateMomentState };

export const payMintMoment = createAsyncThunk<void, PayMintMomentPayload, AsyncThunkAPI>(
  'moment/payMintMoment',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(cleanPayment() as unknown as AnyAction);
      dispatch(
        setPaymentStatus({
          id: payload.data.nft!.id,
          key: payload.key,
          action: 'mintMoment',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      let data = '',
        cover = '';

      if (payload.data.dataProtocol === 'ipfs') {
        data = makeDummyIPFS();
      }

      if (payload.data.coverProtocol === 'ipfs') {
        cover = makeDummyIPFS();
      }

      const transactionPayload: AppTransaction<MintMomentUI> = await createTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.mintMoment,
        {
          nftId: payload.data.nft!.id,
          data,
          dataMime: payload.data.dataMime,
          dataExtension: payload.data.dataExtension,
          dataSize: payload.data.dataSize,
          dataProtocol: payload.data.dataProtocol,
          cover,
          coverMime: payload.data.coverMime,
          coverExtension: payload.data.coverExtension,
          coverSize: payload.data.coverSize,
          coverProtocol: payload.data.coverProtocol,
          text: makeDummyIPFS(),
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
            type: 'mintMoment',
            icon: iconMap.buy,
            name: i18n.t('payment:payMintMomentName'),
            description: i18n.t('payment:payMintMomentDescription', {
              target: `${payload.data.nft?.symbol}#${payload.data.nft?.serial}`,
            }),
            amount: '0',
            currency: COIN_NAME,
            payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
            meta: JSON.stringify(payload.data),
          },
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(hidePayment());
      dispatch(
        setPaymentStatus({
          id: payload.data.nft!.id,
          key: payload.key,
          action: 'mintMoment',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
