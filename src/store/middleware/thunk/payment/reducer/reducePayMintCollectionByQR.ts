import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';
import { MintNFTByQRUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_type_qr_asset';

export const reducePayMintCollectionByQR = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayMintCollectionByQR' });
    dispatch(setPaymentStatusInReducer({ action: 'mintCollectionByQR', type: 'process', message: '' }));

    const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<MintNFTByQRUI>;

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(setPaymentStatusInReducer({ action: 'mintCollectionByQR', type: 'success', message: '' }));
    } else {
      dispatch(setPaymentStatusInReducer({ action: 'mintCollectionByQR', type: 'error', message: response.data }));
    }
  } catch (err: any) {
    handleError(err);
    dispatch(setPaymentStatusInReducer({ action: 'mintCollectionByQR', type: 'error', message: err.message }));
  } finally {
    dispatch(hideModalLoader());
  }
};
