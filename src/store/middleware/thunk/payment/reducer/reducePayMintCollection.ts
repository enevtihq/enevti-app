import { selectPaymentActionPayload, setPaymentStatusInReducer } from 'enevti-app/store/slices/payment';
import { AppThunk } from 'enevti-app/store/state';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { MintNFTUI } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_asset';
import { handleError } from 'enevti-app/utils/error/handle';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { postTransaction } from 'enevti-app/service/enevti/transaction';

export const reducePayMintCollection = (): AppThunk => async (dispatch, getState) => {
  const payload = JSON.parse(selectPaymentActionPayload(getState())) as AppTransaction<MintNFTUI>;
  try {
    dispatch(showModalLoader());
    dispatch({ type: 'payment/reducePayMintCollection' });
    dispatch(
      setPaymentStatusInReducer({ id: payload.asset.id, action: 'mintCollection', type: 'process', message: '' }),
    );

    const response = await postTransaction(payload);
    if (response.status === 200) {
      dispatch(
        setPaymentStatusInReducer({
          id: payload.asset.id,
          action: 'mintCollection',
          type: 'success',
          message: response.data.transactionId,
        }),
      );
    } else {
      dispatch(
        setPaymentStatusInReducer({
          id: payload.asset.id,
          action: 'mintCollection',
          type: 'error',
          message: response.data,
        }),
      );
    }
  } catch (err: any) {
    handleError(err);
    dispatch(
      setPaymentStatusInReducer({
        id: payload.asset.id,
        action: 'mintCollection',
        type: 'error',
        message: err.message,
      }),
    );
  } finally {
    dispatch(hideModalLoader());
  }
};
