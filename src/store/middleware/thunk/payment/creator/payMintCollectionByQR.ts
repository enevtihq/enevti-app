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
import { Collection } from 'enevti-app/types/core/chain/collection';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import { MintNFTByQR, MintNFTByQRUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import base64 from 'react-native-base64';
import { getCollectionById } from 'enevti-app/service/enevti/collection';

type PayMintCollectionByQRPayload = { key: string; collection: Collection; payload: string };

export const payMintCollectionByQR = createAsyncThunk<void, PayMintCollectionByQRPayload, AsyncThunkAPI>(
  'collection/payMintCollectionByQR',
  async (payload, { dispatch, signal }) => {
    try {
      const mintNftByQrUI = JSON.parse(payload.payload) as MintNFTByQRUI;
      const { id, quantity, nonce } = JSON.parse(base64.decode(mintNftByQrUI.body)) as MintNFTByQR;
      if (payload.collection.id !== id) {
        throw Error(i18n.t('error:invalidTransactionPayload'));
      }
      const collection = await getCollectionById(id, signal);
      if (collection.status !== 200 || collection.data.stat.minted !== nonce) {
        throw Error(i18n.t('collection:invalidQRCode'));
      }

      dispatch(
        setPaymentStatus({
          id: payload.collection.id,
          key: payload.key,
          action: 'mintCollectionByQR',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      const transactionPayload: AppTransaction<MintNFTByQRUI> = await createTransaction(
        redeemableNftModule.moduleID,
        redeemableNftModule.mintNftTypeQr,
        { body: mintNftByQrUI.body, signature: mintNftByQrUI.signature },
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
          type: 'mintCollectionByQR',
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
          amount: (BigInt(payload.collection.minting.price.amount) * BigInt(quantity)).toString(),
          currency: payload.collection.minting.price.currency,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
          meta: '',
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(
        setPaymentStatus({
          id: payload.collection.id,
          key: payload.key,
          action: 'mintCollectionByQR',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
