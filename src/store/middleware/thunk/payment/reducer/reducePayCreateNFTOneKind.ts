import { uploadURItoIPFS } from 'enevti-app/service/ipfs';
import { setPaymentStatus, selectPaymentActionPayload } from 'enevti-app/store/slices/payment';
import {
  hideModalLoader,
  resetModalLoaderText,
  setModalLoaderText,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk } from 'enevti-app/store/state';
import { CreateNFTOneKind } from 'enevti-app/types/ui/store/CreateNFTQueue';
import { handleError } from 'enevti-app/utils/error/handle';
import { dateOfNearestDay } from 'enevti-app/utils/date/calendar';
import i18n from 'enevti-app/translations/i18n';
import { CreateOneKindNFTUI } from 'enevti-app/types/core/asset/redeemable_nft/create_onekind_nft_asset';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';

export const reducePayCreateNFTOneKind = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayCreateNFTOneKind' });
    dispatch(setPaymentStatus({ type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as CreateNFTOneKind;
    if (!payload.transaction) {
      throw Error(i18n.t('error:unknownError'));
    }

    const transactionPayload: AppTransaction<CreateOneKindNFTUI> = payload.transaction;

    let data = payload.transaction.asset.data,
      cover = payload.transaction.asset.cover,
      content = payload.transaction.asset.content;

    // if (payload.state.storageProtocol === 'ipfs') {
    //   const provider = payload.state.storageProtocol;
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'data', provider })));
    //   data = await uploadURItoIPFS(payload.data.uri);
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'cover', provider })));
    //   cover = payload.state.coverUri ? await uploadURItoIPFS(payload.state.coverUri) : data;
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'content', provider })));
    //   content = payload.state.utility === 'content' ? await uploadURItoIPFS(payload.state.contentUri) : '';
    // }

    transactionPayload.asset.data = data;
    transactionPayload.asset.cover = cover;
    transactionPayload.asset.content = content;

    if (transactionPayload.asset.recurring !== 'anytime') {
      const { time, from } = parseTransactionPayloadTime(payload);
      transactionPayload.asset.time = time;
      transactionPayload.asset.from = from;
    }

    dispatch(setModalLoaderText(i18n.t('payment:postingTransaction')));
    const response = await postTransaction(transactionPayload);
    if (response.status === 200) {
      dispatch(setPaymentStatus({ type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatus({ type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatus({ type: 'error', message: err.message }));
  } finally {
    dispatch(resetModalLoaderText());
    dispatch(hideModalLoader());
  }
};

export function parseTransactionPayloadTime(payload: CreateNFTOneKind) {
  if (!payload.transaction) {
    throw Error(i18n.t('error:unknownError'));
  }

  let ret: Date = new Date();
  let time = payload.transaction.asset.time;
  let from = payload.transaction.asset.from;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  switch (payload.transaction.asset.recurring) {
    case 'daily':
      ret = new Date(year, month, date, payload.transaction.asset.from.hour, payload.transaction.asset.from.minute);
      break;
    case 'weekly':
      ret = new Date(
        year,
        month,
        dateOfNearestDay(now, payload.transaction.asset.time.day).getDate(),
        payload.transaction.asset.from.hour,
        payload.transaction.asset.from.minute,
      );
      break;
    case 'monthly':
      ret = new Date(
        year,
        month,
        payload.transaction.asset.time.date,
        payload.transaction.asset.from.hour,
        payload.transaction.asset.from.minute,
      );
      time = {
        ...time,
        date: ret.getDate(),
      };
      break;
    case 'yearly':
      ret = new Date(
        year,
        payload.transaction.asset.time.month,
        payload.transaction.asset.time.date,
        payload.transaction.asset.from.hour,
        payload.transaction.asset.from.minute,
      );
      time = {
        ...time,
        month: ret.getMonth(),
        date: ret.getDate(),
      };
      break;
    case 'once':
      ret = new Date(
        payload.transaction.asset.time.year,
        payload.transaction.asset.time.month,
        payload.transaction.asset.time.date,
        payload.transaction.asset.from.hour,
        payload.transaction.asset.from.minute,
      );
      time = {
        ...time,
        year: ret.getFullYear(),
        month: ret.getMonth(),
        date: ret.getDate(),
      };
      break;
    default:
      break;
  }

  from = {
    hour: ret.getHours(),
    minute: ret.getMinutes(),
  };

  return { time, from };
}
