import {
  iconMap,
  UNDEFINED_ICON,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { calculateGasFee } from 'enevti-app/service/enevti/transaction';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import { MintCollectionTransaction } from 'enevti-app/types/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';

type PayMintCollectionPayload = { collection: Collection; quantity: number };

export const payMintCollection = createAsyncThunk<
  void,
  PayMintCollectionPayload,
  AsyncThunkAPI
>('collection/payMintCollection', async (payload, { dispatch, signal }) => {
  dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
  const transactionPayload: MintCollectionTransaction = {
    id: payload.collection.id,
    quantity: payload.quantity,
  };
  const gasFee = await calculateGasFee(transactionPayload, signal);
  dispatch(setPaymentFee({ gas: gasFee, platform: BigInt(0) }));
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
      amount:
        BigInt(payload.collection.minting.price.amount) *
        BigInt(payload.quantity),
      currency: payload.collection.minting.price.currency,
      payload: JSON.stringify(transactionPayload),
    }),
  );
  dispatch(showPayment());
});
