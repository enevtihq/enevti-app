import { uploadTextToIPFS, uploadURItoIPFS } from 'enevti-app/service/ipfs';
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
import { handleError } from 'enevti-app/utils/error/handle';
import i18n from 'enevti-app/translations/i18n';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { MintMomentUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_moment_asset';

export const reducePayMintMoment = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayMintMoment' });
    dispatch(setPaymentStatusInReducer({ action: 'mintMoment', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<MintMomentUI>;
    const meta = JSON.parse(selectPaymentActionMeta(getState())) as MintMomentUI;

    const transactionPayload: AppTransaction<MintMomentUI> = payload;

    let data = payload.asset.data,
      cover = payload.asset.cover;

    if (meta.dataProtocol === 'ipfs') {
      dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'data', provider: meta.dataProtocol })));
      data = await uploadURItoIPFS(meta.data);
    }

    if (meta.coverProtocol === 'ipfs') {
      dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'cover', provider: meta.coverProtocol })));
      cover = await uploadURItoIPFS(meta.cover);
    }

    transactionPayload.asset.data = data;
    transactionPayload.asset.cover = cover;

    dispatch(setModalLoaderText(i18n.t('payment:uploadingTo', { file: 'caption', provider: 'ipfs' })));
    transactionPayload.asset.text = await uploadTextToIPFS(meta.text);

    dispatch(setModalLoaderText(i18n.t('payment:postingTransaction')));
    const response = await postTransaction(transactionPayload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          action: 'mintMoment',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'mintMoment', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'mintMoment', type: 'error', message: err.message }));
  } finally {
    dispatch(resetModalLoaderText());
    dispatch(hideModalLoader());
  }
};
