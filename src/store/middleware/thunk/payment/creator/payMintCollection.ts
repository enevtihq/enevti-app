import { iconMap, UNDEFINED_ICON } from 'enevti-app/components/atoms/icon/AppIconComponent';
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
import { handleError } from 'enevti-app/utils/error/handle';
import { MintNFTUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_asset';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';

type PayMintCollectionPayload = { collection: Collection; quantity: number };

export const payMintCollection = createAsyncThunk<void, PayMintCollectionPayload, AsyncThunkAPI>(
  'collection/payMintCollection',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
      dispatch(showPayment());

      const transactionPayload: AppTransaction<MintNFTUI> = await createTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.mintNft,
        {
          id: payload.collection.id,
          quantity: payload.quantity,
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

      dispatch(setPaymentFee({ gas: gasFee, platform: '0' }));
      dispatch(setPaymentPriority('normal'));
      dispatch(
        setPaymentAction({
          type: 'mintCollection',
          icon:
            payload.collection.collectionType === 'onekind'
              ? iconMap.buy
              : payload.collection.collectionType === 'packed'
              ? iconMap.random
              : UNDEFINED_ICON,
          name:
            payload.collection.collectionType === 'onekind'
              ? i18n.t('payment:payMintOneKindName')
              : payload.collection.collectionType === 'packed'
              ? i18n.t('payment:payMintPackedName')
              : i18n.t('error:unknown'),
          description: `${payload.collection.name} (${
            payload.collection.collectionType === 'onekind'
              ? i18n.t('payment:payMintOneKindDescription')
              : payload.collection.collectionType === 'packed'
              ? i18n.t('payment:payMintPackedDescription', {
                  packSize: payload.collection.packSize,
                })
              : i18n.t('error:unknown')
          })`,
          amount: (BigInt(payload.collection.minting.price.amount) * BigInt(payload.quantity)).toString(),
          currency: payload.collection.minting.price.currency,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
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
