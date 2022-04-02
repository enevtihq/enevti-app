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
import { AppThunk } from 'enevti-app/store/state';
import { calculateGasFee } from 'enevti-app/service/enevti/transaction';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import { MintCollectionTransaction } from 'enevti-app/types/service/enevti/transaction';
import i18n from 'enevti-app/translations/i18n';

export const payMintCollection =
  (payload: { collection: Collection; quantity: number }): AppThunk =>
  async dispatch => {
    dispatch({ type: 'collection/payMintCollection' });
    dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
    const transactionPayload: MintCollectionTransaction = {
      id: payload.collection.id,
      quantity: payload.quantity,
    };
    const gasFee = await calculateGasFee(transactionPayload);
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
            ? i18n.t('collection:mintOneKind')
            : payload.collection.collectionType === 'packed'
            ? i18n.t('collection:mintPacked')
            : 'Unknown',
        description: `${payload.collection.name} (${
          payload.collection.collectionType === 'onekind'
            ? i18n.t('collection:mintOneKindDescription')
            : payload.collection.collectionType === 'packed'
            ? i18n.t('collection:mintPackedDescription', {
                packSize: payload.collection.packSize,
              })
            : 'Unknown'
        })`,
        amount:
          BigInt(payload.collection.minting.price.amount) *
          BigInt(payload.quantity),
        currency: payload.collection.minting.price.currency,
        payload: JSON.stringify(transactionPayload),
      }),
    );
    dispatch(showPayment());
  };
