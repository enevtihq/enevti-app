import { uploadURItoIPFS } from 'enevti-app/service/ipfs';
import {
  setPaymentStatusInReducer,
  selectPaymentActionPayload,
  selectPaymentActionMeta,
} from 'enevti-app/store/slices/payment';
import {
  hideModalLoader,
  resetModalLoaderText,
  setModalLoaderText,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk } from 'enevti-app/store/state';
import { CreateNFTOneKindMeta, CreateNFTOneKindTransaction } from 'enevti-app/types/ui/store/CreateNFTQueue';
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
    dispatch(setPaymentStatusInReducer({ action: 'createNFTOneKind', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as CreateNFTOneKindTransaction;
    const meta = JSON.parse(selectPaymentActionMeta(getState())) as CreateNFTOneKindMeta;

    const transactionPayload: AppTransaction<CreateOneKindNFTUI> = payload;

    let data = payload.asset.data,
      cover = payload.asset.cover,
      content = payload.asset.content;

    // if (meta.state.storageProtocol === 'ipfs') {
    //   const provider = meta.state.storageProtocol;
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'data', provider })));
    //   data = await uploadURItoIPFS(meta.data.uri);
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'cover', provider })));
    //   cover = meta.state.coverUri ? await uploadURItoIPFS(meta.state.coverUri) : data;
    //   dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'content', provider })));
    //   content = meta.state.utility === 'content' ? await uploadURItoIPFS(meta.state.contentUri) : '';
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
      dispatch(setPaymentStatusInReducer({ type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatusInReducer({ type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ type: 'error', message: err.message }));
  } finally {
    dispatch(resetModalLoaderText());
    dispatch(hideModalLoader());
  }
};

export function parseTransactionPayloadTime(payload: CreateNFTOneKindTransaction) {
  if (!payload) {
    throw Error(i18n.t('error:unknownError'));
  }

  let ret: Date = new Date();
  let time = payload.asset.time;
  let from = payload.asset.from;

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();

  switch (payload.asset.recurring) {
    case 'daily':
      ret = new Date(year, month, date, payload.asset.from.hour, payload.asset.from.minute);
      break;
    case 'weekly':
      ret = new Date(
        year,
        month,
        dateOfNearestDay(now, payload.asset.time.day).getDate(),
        payload.asset.from.hour,
        payload.asset.from.minute,
      );
      break;
    case 'monthly':
      ret = new Date(year, month, payload.asset.time.date, payload.asset.from.hour, payload.asset.from.minute);
      time = {
        ...time,
        date: ret.getUTCDate(),
      };
      break;
    case 'yearly':
      ret = new Date(
        year,
        payload.asset.time.month,
        payload.asset.time.date,
        payload.asset.from.hour,
        payload.asset.from.minute,
      );
      time = {
        ...time,
        month: ret.getUTCMonth(),
        date: ret.getUTCDate(),
      };
      break;
    case 'once':
      ret = new Date(
        payload.asset.time.year,
        payload.asset.time.month,
        payload.asset.time.date,
        payload.asset.from.hour,
        payload.asset.from.minute,
      );
      time = {
        ...time,
        year: ret.getUTCFullYear(),
        month: ret.getUTCMonth(),
        date: ret.getUTCDate(),
      };
      break;
    default:
      break;
  }

  from = {
    hour: ret.getUTCHours(),
    minute: ret.getUTCMinutes(),
  };

  return { time, from };
}
